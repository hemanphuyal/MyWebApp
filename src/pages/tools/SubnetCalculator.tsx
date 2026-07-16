import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Copy, Check } from 'lucide-react'

interface SubnetResult {
  networkAddress: string; broadcastAddress: string; firstHost: string; lastHost: string
  totalHosts: string; usableHosts: string; subnetMask: string; wildcardMask: string
  binaryMask: string; ipClass: string; ipType: string
}
interface IPv6Result {
  fullAddress: string; shortAddress: string; networkPrefix: string; hostPart: string
  totalAddresses: string; prefixLength: number; addressType: string; scope: string
}

export default function SubnetCalculator() {
  const [ipType, setIpType] = useState<'ipv4' | 'ipv6'>('ipv4')
  const [ip, setIp] = useState('192.168.1.0')
  const [ipv6, setIpv6] = useState('2001:0db8:85a3:0000:0000:8a2e:0370:7334')
  const [cidr, setCidr] = useState(24)
  const [cidr6, setCidr6] = useState(64)
  const [result, setResult] = useState<SubnetResult | null>(null)
  const [result6, setResult6] = useState<IPv6Result | null>(null)
  const [copied, setCopied] = useState('')

  const commonSubnets = [8, 16, 24, 28, 30]
  const commonSubnets6 = [48, 56, 64, 112, 128]

  const getIpClass = (ipStr: string): string => {
    const f = parseInt(ipStr.split('.')[0])
    if (f >= 1 && f <= 126) return 'Class A'
    if (f >= 128 && f <= 191) return 'Class B'
    if (f >= 192 && f <= 223) return 'Class C'
    if (f >= 224 && f <= 239) return 'Class D'
    return 'Class E'
  }
  const getIpTypeStr = (ipStr: string): string => {
    const p = ipStr.split('.').map(Number)
    if (p[0] === 10) return 'Private'
    if (p[0] === 172 && p[1] >= 16 && p[1] <= 31) return 'Private'
    if (p[0] === 192 && p[1] === 168) return 'Private'
    if (p[0] === 127) return 'Loopback'
    return 'Public'
  }

  const calculateSubnet = () => {
    const parts = ip.split('.').map(Number)
    if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) return
    if (cidr < 0 || cidr > 32) return
    const ipBinary = parts.map((p) => p.toString(2).padStart(8, '0')).join('')
    const networkBinary = ipBinary.slice(0, cidr).padEnd(32, '0')
    const broadcastBinary = ipBinary.slice(0, cidr).padEnd(32, '1')
    const binaryToIp = (b: string) => {
      const out: number[] = []
      for (let i = 0; i < 32; i += 8) out.push(parseInt(b.slice(i, i + 8), 2))
      return out.join('.')
    }
    const totalHosts = Math.pow(2, 32 - cidr)
    const maskBinary = '1'.repeat(cidr).padEnd(32, '0')
    const wildcardBinary = '0'.repeat(cidr).padEnd(32, '1')
    setResult({
      networkAddress: binaryToIp(networkBinary),
      broadcastAddress: binaryToIp(broadcastBinary),
      firstHost: binaryToIp(networkBinary.slice(0, 31) + '1'),
      lastHost: binaryToIp(broadcastBinary.slice(0, 31) + '0'),
      totalHosts: totalHosts.toLocaleString(),
      usableHosts: Math.max(0, totalHosts - 2).toLocaleString(),
      subnetMask: binaryToIp(maskBinary),
      wildcardMask: binaryToIp(wildcardBinary),
      binaryMask: maskBinary.match(/.{8}/g)?.join('.') || '',
      ipClass: getIpClass(ip),
      ipType: getIpTypeStr(ip),
    })
  }

  const expandIPv6 = (addr: string): string => {
    let parts = addr.split('::')
    if (parts.length === 2) {
      const left = parts[0] ? parts[0].split(':') : []
      const right = parts[1] ? parts[1].split(':') : []
      const missing = 8 - left.length - right.length
      parts = [...left, ...Array(missing).fill('0000'), ...right]
    } else {
      parts = addr.split(':')
    }
    return parts.map((p) => p.padStart(4, '0')).join(':')
  }
  const compressIPv6 = (addr: string): string => {
    const parts = addr.split(':').map((p) => p.replace(/^0+/, '') || '0')
    let longestStart = -1, longestLen = 0, currentStart = -1, currentLen = 0
    for (let i = 0; i < parts.length; i++) {
      if (parts[i] === '0') {
        if (currentStart === -1) currentStart = i
        currentLen++
      } else {
        if (currentLen > longestLen) { longestStart = currentStart; longestLen = currentLen }
        currentStart = -1; currentLen = 0
      }
    }
    if (currentLen > longestLen) { longestStart = currentStart; longestLen = currentLen }
    if (longestLen > 1) {
      return `${parts.slice(0, longestStart).join(':')}::${parts.slice(longestStart + longestLen).join(':')}`
    }
    return parts.join(':')
  }
  const getIPv6Type = (addr: string): string => {
    const full = expandIPv6(addr).toLowerCase()
    if (full.startsWith('fe80:')) return 'Link-Local'
    if (full.startsWith('fc') || full.startsWith('fd')) return 'Unique Local'
    if (full.startsWith('ff')) return 'Multicast'
    if (full === '0000:0000:0000:0000:0000:0000:0000:0001') return 'Loopback'
    if (full === '0000:0000:0000:0000:0000:0000:0000:0000') return 'Unspecified'
    if (full.startsWith('2001:0db8:')) return 'Documentation'
    if (full.startsWith('2') || full.startsWith('3')) return 'Global Unicast'
    return 'Reserved'
  }
  const getIPv6Scope = (t: string): string => ({
    'Link-Local': 'Local network only', 'Unique Local': 'Organization-wide',
    'Multicast': 'One-to-many', 'Loopback': 'Local machine',
    'Global Unicast': 'Internet-routable', 'Documentation': 'Examples only',
  } as Record<string, string>)[t] || 'Special purpose'

  const calculateIPv6Subnet = () => {
    try {
      const fullAddress = expandIPv6(ipv6)
      const shortAddress = compressIPv6(fullAddress)
      const hexParts = fullAddress.split(':')
      const binaryStr = hexParts.map((h) => parseInt(h, 16).toString(2).padStart(16, '0')).join('')
      const networkBinary = binaryStr.slice(0, cidr6).padEnd(128, '0')
      const networkHex: string[] = []
      for (let i = 0; i < 128; i += 16) networkHex.push(parseInt(networkBinary.slice(i, i + 16), 2).toString(16).padStart(4, '0'))
      const networkPrefix = compressIPv6(networkHex.join(':'))
      const hostBinary = binaryStr.slice(cidr6)
      const hostPart = hostBinary.length > 0 ? `::${parseInt(hostBinary, 2).toString(16) || '0'}` : '::0'
      const hostBits = 128 - cidr6
      let totalAddresses: string
      if (hostBits >= 64) totalAddresses = `2^${hostBits}`
      else if (hostBits >= 40) totalAddresses = `2^${hostBits} (≈ ${(Math.pow(2, hostBits) / 1e12).toFixed(0)} trillion)`
      else totalAddresses = Math.pow(2, hostBits).toLocaleString()
      const addressType = getIPv6Type(ipv6)
      setResult6({ fullAddress, shortAddress, networkPrefix, hostPart, totalAddresses, prefixLength: cidr6, addressType, scope: getIPv6Scope(addressType) })
    } catch { /* ignore */ }
  }

  const copyValue = (value: string, key: string) => {
    navigator.clipboard.writeText(value); setCopied(key); setTimeout(() => setCopied(''), 1500)
  }

  const Row = ({ label, value, copyKey }: { label: string; value: string; copyKey: string }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
      <span className="small secondary">{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span className="mono small" style={{ fontWeight: 500, wordBreak: 'break-all', textAlign: 'right' }}>{value}</span>
        <button className="btn btn--ghost btn--icon" onClick={() => copyValue(value, copyKey)} aria-label="Copy">
          {copied === copyKey ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
    </div>
  )

  const tabBtn = (active: boolean): React.CSSProperties => ({
    flex: 1, padding: '10px 16px', fontSize: '0.875rem', fontWeight: 500,
    background: active ? 'var(--text)' : 'transparent',
    color: active ? 'var(--bg)' : 'var(--text)',
    border: '1px solid var(--border)', borderRadius: 'var(--radius)',
    cursor: 'pointer', font: 'inherit', transition: 'all var(--transition)',
  })

  const chipBtn = (active: boolean): React.CSSProperties => ({
    padding: '6px 12px', fontSize: '0.8125rem', fontWeight: 500,
    background: active ? 'var(--text)' : 'var(--bg)',
    color: active ? 'var(--bg)' : 'var(--text)',
    border: '1px solid var(--border)', borderRadius: 'var(--radius)',
    cursor: 'pointer', font: 'inherit',
  })

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 760 }}>
        <Link to="/tools" className="small secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <ArrowLeft size={14} /> Tools
        </Link>
        <span className="small muted mono" style={{ display: 'block', marginTop: 24 }}>— Tools</span>
        <h1 style={{ marginTop: 16 }}>Subnet Calculator</h1>
        <p className="secondary" style={{ marginTop: 16, maxWidth: 560, lineHeight: 1.7 }}>
          Calculate IPv4 and IPv6 subnet details from an IP address and CIDR notation.
        </p>

        <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={tabBtn(ipType === 'ipv4')} onClick={() => setIpType('ipv4')}>IPv4</button>
            <button style={tabBtn(ipType === 'ipv6')} onClick={() => setIpType('ipv6')}>IPv6</button>
          </div>

          {ipType === 'ipv4' ? (
            <>
              <div className="card">
                <label>IP address</label>
                <input className="input mono" value={ip} onChange={(e) => setIp(e.target.value)} placeholder="192.168.1.0" />

                <label style={{ marginTop: 16 }}>CIDR (/{cidr})</label>
                <input type="range" min={0} max={32} value={cidr} onChange={(e) => setCidr(Number(e.target.value))} style={{ width: '100%' }} />

                <label style={{ marginTop: 16 }}>Common subnets</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
                  {commonSubnets.map((s) => (
                    <button key={s} style={chipBtn(cidr === s)} onClick={() => setCidr(s)}>/{s}</button>
                  ))}
                </div>

                <button className="btn btn--primary" onClick={calculateSubnet} style={{ marginTop: 20, width: '100%' }}>Calculate</button>
              </div>

              {result && (
                <div className="card">
                  <div style={{ fontWeight: 600, marginBottom: 8 }}>Results</div>
                  <Row label="Network Address" value={result.networkAddress} copyKey="network" />
                  <Row label="Broadcast Address" value={result.broadcastAddress} copyKey="broadcast" />
                  <Row label="First Usable Host" value={result.firstHost} copyKey="first" />
                  <Row label="Last Usable Host" value={result.lastHost} copyKey="last" />
                  <Row label="Subnet Mask" value={result.subnetMask} copyKey="mask" />
                  <Row label="Wildcard Mask" value={result.wildcardMask} copyKey="wildcard" />
                  <Row label="Total Hosts" value={result.totalHosts} copyKey="total" />
                  <Row label="Usable Hosts" value={result.usableHosts} copyKey="usable" />
                  <Row label="IP Class" value={result.ipClass} copyKey="class" />
                  <Row label="IP Type" value={result.ipType} copyKey="type" />
                  <div style={{ paddingTop: 12 }}>
                    <div className="small secondary" style={{ marginBottom: 6 }}>Binary netmask</div>
                    <div className="mono small" style={{ padding: 12, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', wordBreak: 'break-all' }}>{result.binaryMask}</div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="card">
                <label>IPv6 address</label>
                <input className="input mono" value={ipv6} onChange={(e) => setIpv6(e.target.value)} placeholder="2001:db8::1" style={{ fontSize: '0.875rem' }} />

                <label style={{ marginTop: 16 }}>Prefix length (/{cidr6})</label>
                <input type="range" min={1} max={128} value={cidr6} onChange={(e) => setCidr6(Number(e.target.value))} style={{ width: '100%' }} />

                <label style={{ marginTop: 16 }}>Common prefixes</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
                  {commonSubnets6.map((s) => (
                    <button key={s} style={chipBtn(cidr6 === s)} onClick={() => setCidr6(s)}>/{s}</button>
                  ))}
                </div>

                <button className="btn btn--primary" onClick={calculateIPv6Subnet} style={{ marginTop: 20, width: '100%' }}>Calculate</button>
              </div>

              {result6 && (
                <div className="card">
                  <div style={{ fontWeight: 600, marginBottom: 8 }}>Results</div>
                  <Row label="Full Address" value={result6.fullAddress} copyKey="full" />
                  <Row label="Short Address" value={result6.shortAddress} copyKey="short" />
                  <Row label="Network Prefix" value={`${result6.networkPrefix}/${result6.prefixLength}`} copyKey="prefix" />
                  <Row label="Total Addresses" value={result6.totalAddresses} copyKey="total6" />
                  <Row label="Address Type" value={result6.addressType} copyKey="type6" />
                  <Row label="Scope" value={result6.scope} copyKey="scope6" />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  )
}
