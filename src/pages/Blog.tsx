import { useTranslation } from 'react-i18next'
import { BookOpen } from 'lucide-react'
import ComingSoon from '../components/ComingSoon'

export default function Blog() {
  const { t } = useTranslation()
  return <ComingSoon icon={<BookOpen size={28} strokeWidth={1.5} />} title={t('blog.title')} sub={t('blog.sub')} />
}
