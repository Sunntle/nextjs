// import Link from 'next/link'
// import { Trans } from 'react-i18next/TransWithoutContext'
// import { languages } from '@/i18n/setting'
// import { useTranslation } from '@/i18n'

// export const Footer = async ({ lng }:{lng:string}) => {
//   const { t } = await useTranslation(lng, 'footer')
//   return (
//     <footer style={{ marginTop: 50 }}>
//       <Trans i18nKey="languageSwitcher" t={t}>
//         Switch from <strong>{{lng}}</strong> to:{' '}
//       </Trans>
//       {languages.filter((l) => lng !== l).map((l, index) => {
//         return (
//           <span key={l}>
//             {index > 0 && (' or ')}
//             <Link href={`/${l}`}>
//               {l}
//             </Link>
//           </span>
//         )
//       })}
//     </footer>
//   )
// }
//client side

'use client'

import { FooterBase } from './FooterBase'
import { useTranslation } from '@/i18n/client'

export const Footer = ({ lng }:{lng:string}) => {
  const { t } = useTranslation(lng, 'footer')
  return <FooterBase t={t} lng={lng} />
}
