import { createI18n } from 'vue-i18n'

async function getBrowserLocale(): Promise<string> {
    const nav = window.navigator as Navigator & { languages?: string[] }
    const raw = (nav.languages && nav.languages[0]) || (nav as any).language
    const rawStr = String(raw ?? 'en')
    const parts = rawStr.split('-')
    return (parts[0] ?? 'en').toLowerCase()
}

async function loadLocaleMessages(locale: string): Promise<Record<string, any>> {
    try {
        const mod = await import(`./locales/${locale}.json`)
        return (mod && (mod as any).default) || (mod as any) || {}
    } catch (e) {
        if (locale !== 'en') {
            try {
                const en = await import('./locales/en.json')
                return (en && (en as any).default) || (en as any) || {}
            } catch (e2) {
                return {}
            }
        }
        return {}
    }
}

export async function setupI18n() {
    const detected = await getBrowserLocale()
    const supported = ['en', 'es']
    const locale = supported.includes(detected) ? detected : (detected.startsWith('es') ? 'es' : 'en')
    const messages = await loadLocaleMessages(locale)

    const i18n = createI18n({
        legacy: false,
        locale,
        fallbackLocale: 'en',
        messages: { [locale]: messages }
    })
        console.log('i18n setup complete', locale)

    return i18n
}

export const supportedLocales = ['en', 'es']
