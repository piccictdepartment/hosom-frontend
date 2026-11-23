'use client';

import { useState, type FormEvent } from 'react';
import Image from 'next/image';
import { StudentModal } from '@/components/student-modal';
import { useWorkflows } from '@/components/workflow-provider';
import type { Payment } from '@/lib/workflows';

const student = { name: 'Thoko Banda', id: 'HOSOM/2026/014' };
const period = '2026 · Semester 2';
const totalCharged = 235000;
const initialPaid = 150000;
const dueAt = '2026-12-02';
const charges = [
  { id: 'tuition', description: 'Tuition fee', amount: 200000 },
  { id: 'resources', description: 'Learning resources fee', amount: 35000 },
];
const seededPayments: Payment[] = [
  { id: 'DEMO-PAY-1', student: student.name, amount: 100000, method: 'Bank transfer', status: 'Confirmed', reference: 'TXN-2026-0001', receiptNumber: 'RCT-2026-0001', paidAt: '2026-10-29T16:00:00Z' },
  { id: 'DEMO-PAY-2', student: student.name, amount: 50000, method: 'Airtel Money', status: 'Confirmed', reference: 'TXN-2026-0002', receiptNumber: 'RCT-2026-0002', paidAt: '2026-11-13T16:00:00Z' },
];
const methods = [
  { id: 'airtel', name: 'Airtel Money', copy: 'Pay with your Airtel Money wallet.', action: 'Select Airtel Money' },
  { id: 'mpamba', name: 'TNM Mpamba', copy: 'Pay with your TNM Mpamba wallet.', action: 'Select TNM Mpamba' },
  { id: 'bank', name: 'Bank transfer', copy: 'Record a bank payment against your fees.', action: 'Select bank payment' },
] as const;
type Method = typeof methods[number];
type Step = 'Details' | 'Review' | 'Receipt';
const money = (value: number) => 'MWK ' + value.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const date = (value: string) => new Date(value).toLocaleDateString('en-GB');

function downloadText(filename: string, contents: string, type: string) {
  const url = URL.createObjectURL(new Blob([contents], { type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function Brand({ method }: { method: Method }) {
  return <span className={`sf-pay-brand sf-pay-brand-${method.id}`}>
    {method.id === 'bank' ? <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m3 8 9-5 9 5v2H3V8Zm2 3v8m5-8v8m4-8v8m5-8v8M2 21h20" /></svg><span><b>Banks</b><small>Bank transfer</small></span></> :
      <Image src={method.id === 'airtel' ? '/images/airtel-money.png' : '/images/tnm-mpamba.jpg'} alt={method.name} width={80} height={80} />}
  </span>;
}

function csvCell(value: string | number) { return '"' + String(value).replaceAll('"', '""') + '"'; }

export function StudentFinance() {
  const { state, dispatch } = useWorkflows();
  const [tab, setTab] = useState('Fee statement');
  const [selected, setSelected] = useState<Method | null>(null);
  const [step, setStep] = useState<Step>('Details');
  const [amount, setAmount] = useState('25000');
  const [phone, setPhone] = useState('099 000 0000');
  const [bank, setBank] = useState('HOSOM fees account · •••• 1048');
  const [transferReference, setTransferReference] = useState('BANK-2026-1001');
  const [receipt, setReceipt] = useState<Payment | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const payments = [...state.payments.filter(payment => payment.student === student.name), ...seededPayments];
  const paid = initialPaid + state.payments.filter(payment => payment.student === student.name && payment.status === 'Confirmed').reduce((sum, payment) => sum + payment.amount, 0);
  const balance = Math.max(0, totalCharged - paid);

  function openPayment(method: Method) {
    setSelected(method);
    setStep('Details');
    setAmount(String(Math.min(25000, balance)));
    setReceipt(null);
    setError('');
  }
  function closePayment() {
    setSelected(null);
    setReceipt(null);
    setError('');
  }
  function reviewPayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = Number(amount);
    if (!Number.isFinite(value) || value < 1 || value > balance) {
      setError('Enter an amount between MWK 1 and your outstanding balance.');
      return;
    }
    setError('');
    setStep('Review');
  }
  function confirmPayment() {
    if (!selected) return;
    const value = Number(amount);
    if (!Number.isFinite(value) || value < 1 || value > balance) {
      setError('The amount exceeds your outstanding balance.');
      setStep('Details');
      return;
    }
    const sequence = String(state.payments.length + 3).padStart(4, '0');
    const payment: Payment = {
      id: `DEMO-PAY-${sequence}`, student: student.name, amount: value, method: selected.name,
      status: 'Confirmed', reference: `TXN-2026-${sequence}`, receiptNumber: `RCT-2026-${sequence}`,
      paidAt: new Date().toISOString(), account: selected.id === 'bank' ? bank : phone,
    };
    dispatch({ type: 'payment/demo-confirmed', payment });
    setReceipt(payment);
    setStep('Receipt');
  }
  function downloadReceipt(payment: Payment) {
    downloadText(`${payment.receiptNumber}.txt`, [
      'HOSOM — Payment receipt', `Reference: ${payment.reference}`, `Receipt: ${payment.receiptNumber}`,
      `Student: ${student.name}`, `Student ID: ${student.id}`, `Method: ${payment.method}`,
      `Amount: ${money(payment.amount)}`, `Date: ${payment.paidAt ? new Date(payment.paidAt).toLocaleString('en-GB') : 'Not provided'}`,
      'Status: Confirmed', 'Preview transaction — no funds transferred.',
    ].join('\n'), 'text/plain;charset=utf-8');
  }
  function statementRows() {
    return [
      ['HOSOM — Student fee statement'], ['Student', student.name], ['Student ID', student.id], ['Period', period],
      ['Total fees charged (MWK)', totalCharged], ['Payments received (MWK)', paid], ['Outstanding balance (MWK)', balance],
      [], ['Fee item', 'Amount (MWK)', 'Due date'], ...charges.map(item => [item.description, item.amount, dueAt]),
      [], ['Payment date', 'Reference', 'Amount (MWK)', 'Status'],
      ...payments.map(item => [item.paidAt || 'Not provided', item.reference || item.id, item.amount, item.status]),
    ];
  }
  function exportStatement(format: 'csv' | 'print') {
    const rows = statementRows();
    if (format === 'csv') {
      downloadText('HOSOM-fee-statement.csv', rows.map(row => row.map(csvCell).join(',')).join('\r\n'), 'text/csv;charset=utf-8');
      return;
    }
    const printable = rows.map(row => row.map(cell => String(cell).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')).join(' — ')).join('<br>');
    const printWindow = window.open('', '_blank');
    if (!printWindow) { setNotice('Allow the report window, then try again.'); return; }
    printWindow.opener = null;
    printWindow.document.write(`<!doctype html><html lang="en"><head><title>HOSOM fee statement</title><style>body{font:14px/1.8 Arial,sans-serif;color:#17365a;padding:32px;max-width:780px;margin:auto}h1{font-size:24px;border-bottom:2px solid #2563eb;padding-bottom:14px}main{white-space:normal}</style></head><body><h1>HOSOM — Student fee statement</h1><main>${printable}</main><p>Preview statement · no funds transferred.</p></body></html>`);
    printWindow.document.close();
    printWindow.print();
  }

  return <div className="sf-page">
    <h1>Fees</h1>
    <header className="sf-heading"><div><span className="eyebrow">YOUR STUDENT FEE ACCOUNT</span><p>Review your balance, check payments and find the information you need to settle your fees.</p></div><div className="sf-export" role="group" aria-label="Report export formats"><button onClick={() => exportStatement('csv')}>Export CSV</button><button onClick={() => exportStatement('print')}>Print / Save PDF</button></div></header>
    <section className="sf-summary" aria-label="Fee account summary">
      <div className="sf-balance-card"><span>Outstanding balance</span><strong>{money(balance)}</strong><span className="sf-status">{balance > 0 ? 'Payment outstanding' : 'Account settled'}</span><p>Payment due: {date(dueAt)}</p><button onClick={() => setTab('Payment options')}>View payment options →</button></div>
      <div className="sf-stat"><span>Total fees charged</span><strong>{money(totalCharged)}</strong><small>{period}</small></div>
      <div className="sf-stat"><span>Payments received</span><strong>{money(paid)}</strong><small>Confirmed payments credited to your account</small></div>
    </section>
    <div className="sf-account-line"><span>Account holder: {student.name}</span><span>Student ID: {student.id}</span><span>Currency: Malawi Kwacha (MWK)</span></div>
    <div className="sf-tabs" role="group" aria-label="Fees sections">{['Fee statement', 'Payment history', 'Payment options'].map(label => <button key={label} className={tab === label ? 'active' : ''} aria-pressed={tab === label} onClick={() => setTab(label)}>{label}</button>)}</div>
    {tab === 'Fee statement' && <section className="sf-panel"><div className="sf-panel-title"><h2>Fee breakdown</h2><span>{period}</span></div><div className="sf-table-wrap"><table><thead><tr><th scope="col">Fee item</th><th scope="col">Due date</th><th scope="col">Amount</th></tr></thead><tbody>{charges.map(item => <tr key={item.id}><td>{item.description}</td><td>{date(dueAt)}</td><td>{money(item.amount)}</td></tr>)}</tbody></table></div><div className="sf-statement-total"><strong>Outstanding balance</strong><strong>{money(balance)}</strong></div></section>}
    {tab === 'Payment history' && <section className="sf-panel"><div className="sf-panel-title"><h2>Payments and receipts</h2></div><div className="sf-table-wrap"><table><thead><tr>{['Date', 'Reference', 'Method', 'Amount', 'Status'].map(label => <th key={label} scope="col">{label}</th>)}</tr></thead><tbody>{payments.map(payment => <tr key={payment.id}><td>{payment.paidAt ? date(payment.paidAt) : 'Not provided'}</td><td>{payment.reference || payment.id}</td><td>{payment.method}</td><td>{money(payment.amount)}</td><td><span className={`sf-payment-status ${payment.status === 'Confirmed' ? 'confirmed' : ''}`}>{payment.status}</span></td></tr>)}</tbody></table></div></section>}
    {tab === 'Payment options' && <section className="sf-panel sf-options"><div className="sf-panel-title"><h2>Settle your fees</h2></div><p className="sf-instruction">Choose a payment method. Your student ID is included automatically.</p><div className="sf-reference"><div><small>Your payment reference</small><strong>{student.id}</strong></div><button onClick={async () => { try { await navigator.clipboard.writeText(student.id); setNotice('Payment reference copied.'); } catch { setNotice('Please copy your student ID shown above.'); } }}>Copy reference</button></div><div className="sf-methods">{methods.map(method => <article key={method.id} className="sf-method"><Brand method={method} /><p>{method.copy}</p><button onClick={() => openPayment(method)} disabled={balance <= 0}>{method.action} →</button></article>)}</div>{notice && <p className="sf-notice" role="status">{notice}</p>}<div className="sf-payment-steps"><h3>After making a payment</h3><ol><li>Keep the payment reference and transaction confirmation.</li><li>Provide your student ID when contacting Finance about a payment.</li><li>Check Payment history after Finance confirms and credits the transaction.</li></ol></div></section>}
    <aside className="sf-help"><strong>Questions about your account?</strong><p>Contact the Finance office if a payment is missing, a fee looks incorrect or you need to discuss payment arrangements. Have your student ID and transaction reference ready.</p></aside>
    {selected && <StudentModal label={step === 'Receipt' ? 'Payment receipt' : step === 'Review' ? 'Review payment' : `Pay with ${selected.name}`} onClose={closePayment} className="sf-payment-dialog" scrollKey={step}><button className="student-feature-close" aria-label="Close payment" onClick={closePayment}>×</button><div className={`sf-modal-provider sf-${selected.id}`}><Brand method={selected} /><span>STUDENT FEE PAYMENT</span></div><div className="sf-progress" aria-label="Payment progress">{(['Details', 'Review', 'Receipt'] as Step[]).map((name, index) => <span key={name} className={step === name ? 'current' : (['Details', 'Review', 'Receipt'] as Step[]).indexOf(step) > index ? 'complete' : ''} aria-current={step === name ? 'step' : undefined}><i>{index + 1}</i>{name}</span>)}</div><h2>{step === 'Receipt' ? 'Payment confirmed' : step === 'Review' ? 'Review payment' : 'Payment details'}</h2>{error && <p className="sf-error" role="alert">{error}</p>}
      {step === 'Details' ? <form onSubmit={reviewPayment}><p className="sf-student">{student.name} · {student.id}</p><label>Amount (MWK)<input type="number" required min="1" max={balance} step="0.01" value={amount} onChange={event => setAmount(event.target.value)} /><small>Outstanding: {money(balance)}</small></label>{selected.id === 'bank' ? <><label>Bank account<select value={bank} onChange={event => setBank(event.target.value)}><option>HOSOM fees account · •••• 1048</option><option>HOSOM collections account · •••• 2086</option></select></label><label>Transfer reference<input required maxLength={60} value={transferReference} onChange={event => setTransferReference(event.target.value)} /></label></> : <label>Mobile number<input type="tel" required pattern="[+0-9 ()-]{9,20}" value={phone} onChange={event => setPhone(event.target.value)} /><small>Use sample details for this preview. No wallet PIN is required.</small></label>}<p className="sf-note">Preview only · no real payment will be collected.</p><div className="sf-actions"><button type="button" onClick={closePayment}>Cancel</button><button type="submit">Review payment</button></div></form> : step === 'Review' ? <><dl className="sf-review">{[['Student', student.name], ['Student ID', student.id], ['Method', selected.name], ['Amount', money(Number(amount))], ['Account', selected.id === 'bank' ? bank : phone], ...(selected.id === 'bank' ? [['Transfer reference', transferReference]] : [])].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><p className="sf-note">Preview only. This records a sample payment without charging a wallet or bank account.</p><div className="sf-actions"><button onClick={() => { setStep('Details'); setError(''); }}>Back</button><button onClick={confirmPayment}>Confirm payment</button></div></> : receipt && <><p className="sf-success" role="status">Your fee account has been updated.</p><strong className="sf-amount">{money(receipt.amount)}</strong><dl className="sf-review"><div><dt>Receipt</dt><dd>{receipt.receiptNumber}</dd></div><div><dt>Payment reference</dt><dd>{receipt.reference}</dd></div><div><dt>Remaining balance</dt><dd>{money(balance)}</dd></div></dl><p className="sf-note">Preview transaction. No funds were transferred.</p><div className="sf-actions"><button onClick={() => downloadReceipt(receipt)}>Download receipt</button><button onClick={closePayment}>Done</button></div></>}
    </StudentModal>}
  </div>;
}
