export const fallbackLng = 'en'
export const languages = [fallbackLng, 'vi']
export const defaultNS = 'translation'
export const cookieName = 'i18next'
export const labelLanguages = [{symbol: "en", label: "english"}, {symbol: "vi", label: "vietnamese"}]
export function getOptions (lng = fallbackLng, ns = defaultNS) {
  return {
    // debug: true,
    supportedLngs: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns
  }
}