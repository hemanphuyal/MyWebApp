import { useTranslation } from 'react-i18next'
import { Wrench } from 'lucide-react'
import ComingSoon from '../components/ComingSoon'

export default function Tools() {
  const { t } = useTranslation()
  return <ComingSoon icon={<Wrench size={28} strokeWidth={1.5} />} title={t('tools.title')} sub={t('tools.sub')} />
}
