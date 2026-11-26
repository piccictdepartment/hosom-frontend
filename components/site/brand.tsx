import Image from 'next/image';
import Link from 'next/link';
export function Brand({ light = false }: { light?: boolean }) {
  return <Link className={`brand ${light ? 'brand-light' : ''}`} href="/" aria-label="HOSOM home"><Image src="/images/hosom-logo.png" alt="PICC logo" width={42} height={42} /><span><b>HOSOM</b><small>Hope School of Ministry</small></span></Link>;
}
