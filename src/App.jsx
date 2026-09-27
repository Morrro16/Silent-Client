import { lazy, Suspense, useEffect, useRef, useState } from 'react'

const MagicRings = lazy(() => import('./components/MagicRings.jsx'))
const MorphSlider = lazy(() => import('./components/MorphSlider.jsx'))
const GhostCursor = lazy(() => import('./components/GhostCursor.jsx'))

const logoUrl = `${import.meta.env.BASE_URL}brand-logo.png`
const linuxLogoUrl = `${import.meta.env.BASE_URL}linux.svg`
const clientZipUrl = `${import.meta.env.BASE_URL}downloads/Silent-Client-5.0.zip`

function localizedPageUrl(language, route = '') {
  return `${import.meta.env.BASE_URL}${language === 'en' ? 'en/' : ''}${route ? `${route}/` : ''}`
}

function normalizedPath(path) {
  return path.replace(/\/+$/, '') || '/'
}

function localizedPagePath(language, route = '') {
  return normalizedPath(new URL(localizedPageUrl(language, route), window.location.origin).pathname)
}

const pagePaths = {
  home: { ru: localizedPagePath('ru'), en: localizedPagePath('en') },
  download: { ru: localizedPagePath('ru', 'download'), en: localizedPagePath('en', 'download') },
  documentation: { ru: localizedPagePath('ru', 'documentation'), en: localizedPagePath('en', 'documentation') },
}

function languageFromPath(pathname) {
  const currentPath = normalizedPath(pathname)
  return Object.values(pagePaths).some(paths => paths.en === currentPath) ? 'en' : 'ru'
}

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    const updateMatch = () => setMatches(mediaQuery.matches)
    updateMatch()
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', updateMatch)
      return () => mediaQuery.removeEventListener('change', updateMatch)
    }
    mediaQuery.addListener(updateMatch)
    return () => mediaQuery.removeListener(updateMatch)
  }, [query])

  return matches
}

const showcaseItems = {
  ru: [
    {
      image: `${import.meta.env.BASE_URL}showcase/around-player-indicator.png`,
      title: 'Индикатор игроков вокруг',
      description: 'Круглые индикаторы вокруг игрока показывают, какие игроки находятся рядом.',
    },
    {
      image: `${import.meta.env.BASE_URL}showcase/bind-wheel.png`,
      title: 'Колесо биндов',
      description: 'В колесе собраны разные функции; оно открывается клавишей, выбранной в настройках.',
    },
    {
      image: `${import.meta.env.BASE_URL}showcase/player-mark.png`,
      title: 'Метки игроков',
      description: 'Никнеймы подсвечиваются цветом, соответствующим метке игрока.',
    },
    {
      image: `${import.meta.env.BASE_URL}showcase/trail.png`,
      title: 'Трэйл',
      description: 'За игроком тянется след.',
    },
  ],
  en: [
    {
      image: `${import.meta.env.BASE_URL}showcase/around-player-indicator.png`,
      title: 'Nearby player indicators',
      description: 'Circular indicators show which players are nearby.',
    },
    {
      image: `${import.meta.env.BASE_URL}showcase/bind-wheel.png`,
      title: 'Bind wheel',
      description: 'Open the wheel of actions with a key chosen in settings.',
    },
    {
      image: `${import.meta.env.BASE_URL}showcase/player-mark.png`,
      title: 'Player marks',
      description: 'Player names glow in a color that matches their mark.',
    },
    {
      image: `${import.meta.env.BASE_URL}showcase/trail.png`,
      title: 'Trail',
      description: 'A trail follows the player.',
    },
  ],
}

const translations = {
  ru: {
    home: 'Главная',
    download: 'Скачать',
    overview: 'Обзор',
    documentation: 'Документация',
    navLabel: 'Основная навигация',
    homeLabel: 'На главную Silent Client',
    openMenu: 'Открыть меню',
    closeMenu: 'Закрыть меню',
    previousSlide: 'Предыдущая функция',
    nextSlide: 'Следующая функция',
    slide: 'Функция',
    showcaseLabel: 'Обзор функций Silent Client',
    switchLanguage: 'Switch language to English',
    showcaseTitle: <>Работает <em>идеально</em></>,
    downloadTitle: 'Скачать Silent Client',
    downloadDescription: 'Выберите версию клиента для вашей системы.',
    windowsSupport: 'Windows 11 и более ранние версии',
    linuxSupport: 'Поддержка Linux',
    archiveNote: 'ZIP-архив клиента версии 5.0.',
    downloadWindows: 'Скачать для Windows',
    downloadLinux: 'Скачать для Linux',
    downloadVersion: 'Версия 5.0',
    settingsLocationIntro: 'Все настройки клиента находятся',
    settingsLocation: 'Настройки → SClient',
    docsSidebarLabel: 'ДОКУМЕНТАЦИЯ',
    docsNavigationLabel: 'Разделы Silent Client',
    rights: 'Все права защищены',
    footerPlatform: 'Платформа',
    footerCommunity: 'Сообщество',
    footerCreator: 'Автор',
  },
  en: {
    home: 'Home',
    download: 'Download',
    overview: 'Overview',
    documentation: 'Documentation',
    navLabel: 'Main navigation',
    homeLabel: 'Silent Client home',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    previousSlide: 'Previous feature',
    nextSlide: 'Next feature',
    slide: 'Feature',
    showcaseLabel: 'Silent Client feature overview',
    switchLanguage: 'Переключить язык на русский',
    showcaseTitle: <>Works <em>perfectly</em></>,
    downloadTitle: 'Download Silent Client',
    downloadDescription: 'Choose the client version for your system.',
    windowsSupport: 'Windows 11 and earlier',
    linuxSupport: 'Linux support',
    archiveNote: 'Silent Client version 5.0 ZIP archive.',
    downloadWindows: 'Download for Windows',
    downloadLinux: 'Download for Linux',
    downloadVersion: 'Version 5.0',
    settingsLocationIntro: 'All client settings are located in',
    settingsLocation: 'Settings → SClient',
    docsSidebarLabel: 'DOCUMENTATION',
    docsNavigationLabel: 'Silent Client sections',
    rights: 'All rights reserved',
    footerPlatform: 'Platform',
    footerCommunity: 'Community',
    footerCreator: 'Creator',
  },
}

const seoCopy = {
  ru: {
    home: {
      title: 'Silent Client — клиент для DDRaceNetwork (DDNet)',
      description: 'Silent Client — клиент для DDRaceNetwork (DDNet) с визуальными настройками и дополнительными функциями. Скачать для Windows и Linux, открыть обзор и документацию.',
    },
    download: {
      title: 'Скачать Silent Client 5.0 для Windows и Linux',
      description: 'Скачайте Silent Client 5.0 для DDRaceNetwork. На странице доступны архив клиента для Windows 11 и более ранних версий, а также Linux.',
    },
    documentation: {
      title: 'Документация Silent Client — функции и настройки',
      description: 'Руководство по функциям и настройкам Silent Client: Ти, игроки, чат, интерфейс, экран и мир, текстуры.',
    },
  },
  en: {
    home: {
      title: 'Silent Client — a client for DDRaceNetwork (DDNet)',
      description: 'Silent Client is a DDRaceNetwork (DDNet) client with visual settings and extra features. Download for Windows or Linux, browse the overview, and read the documentation.',
    },
    download: {
      title: 'Download Silent Client 5.0 for Windows and Linux',
      description: 'Download Silent Client 5.0 for DDRaceNetwork. The client archive is available for Windows 11 and earlier versions, as well as Linux.',
    },
    documentation: {
      title: 'Silent Client documentation — features and settings',
      description: 'Guides to Silent Client features and settings: Tee, players, chat, interface, screen and world, and textures.',
    },
  },
}

function Header({ language, setLanguage, text, isDownloadPage, isDocumentationPage }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(() => window.scrollY > 72)

  useEffect(() => {
    const updateVisibility = () => setHasScrolled(window.scrollY > 72)
    updateVisibility()
    window.addEventListener('scroll', updateVisibility, { passive: true })
    return () => window.removeEventListener('scroll', updateVisibility)
  }, [])

  const isSubpage = isDownloadPage || isDocumentationPage
  const homePageUrl = localizedPageUrl(language)
  const homeHref = isSubpage ? homePageUrl : '#home'
  const showcaseHref = isSubpage ? `${homePageUrl}#showcase` : '#showcase'
  const navigation = [
    { label: text.home, href: homeHref, current: !isSubpage },
    { label: text.download, href: localizedPageUrl(language, 'download'), current: isDownloadPage },
    { label: text.overview, href: showcaseHref, current: false },
    { label: text.documentation, href: localizedPageUrl(language, 'documentation'), current: isDocumentationPage },
  ]

  return (
    <header className={`topbar${hasScrolled || isSubpage ? ' is-visible' : ''}`}>
      <a className="brand" href={homePageUrl} aria-label={text.homeLabel}>
        <img className="brand-logo" src={logoUrl} alt="" />
      </a>

      <nav id="site-navigation" className={`site-nav${menuOpen ? ' is-open' : ''}`} aria-label={text.navLabel}>
        {navigation.map(({ label, href, current }) => (
          <a
            key={label}
            className={current ? 'is-active' : ''}
            href={href}
            onClick={() => setMenuOpen(false)}
            aria-current={current ? 'page' : undefined}
          >
            {label}
          </a>
        ))}
      </nav>

      <div className="header-actions">
        <button
          className="language-toggle"
          type="button"
          onClick={() => setLanguage(language === 'ru' ? 'en' : 'ru')}
          aria-label={text.switchLanguage}
          title={text.switchLanguage}
        >
          <svg className="language-globe" aria-hidden="true" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18M12 3c2.3 2.5 3.4 5.5 3.4 9s-1.1 6.5-3.4 9c-2.3-2.5-3.4-5.5-3.4-9S9.7 5.5 12 3Z" />
          </svg>
          <span>{language === 'ru' ? 'RU' : 'EN'}</span>
        </button>
        <button
          className={`menu-toggle${menuOpen ? ' is-open' : ''}`}
          type="button"
          aria-expanded={menuOpen}
          aria-controls="site-navigation"
          aria-label={menuOpen ? text.closeMenu : text.openMenu}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span />
          <span />
        </button>
      </div>
    </header>
  )
}

function DownloadPage({ text }) {
  return (
    <section className="download-page" aria-labelledby="download-title">
      <div className="download-content">
        <h1 id="download-title" className="download-title">{text.downloadTitle}</h1>
        <p className="download-description">{text.downloadDescription}</p>

        <div className="download-grid">
          <article className="download-card download-card-windows">
            <div className="download-platform-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 5.1 10.7 4v7.1H3V5.1Zm9.2-1.3L21 2.5v8.6h-8.8V3.8ZM3 12.4h7.7v7.1L3 18.4v-6Zm9.2 0H21v8.6l-8.8-1.3v-7.3Z" />
              </svg>
            </div>
            <div className="download-card-heading">
              <h2>Windows</h2>
              <span className="download-status">{text.downloadVersion}</span>
            </div>
            <p className="download-support">{text.windowsSupport}</p>
            <p className="download-note">{text.archiveNote}</p>
            <a className="download-cta download-cta-windows" href={clientZipUrl} download="Silent Client-5.0.zip">
              {text.downloadWindows}
              <span aria-hidden="true">↓</span>
            </a>
          </article>

          <article className="download-card download-card-linux">
            <div className="download-platform-icon" aria-hidden="true">
              <img src={linuxLogoUrl} alt="" />
            </div>
            <div className="download-card-heading">
              <h2>Linux</h2>
              <span className="download-status">{text.downloadVersion}</span>
            </div>
            <p className="download-support">{text.linuxSupport}</p>
            <p className="download-note">{text.archiveNote}</p>
            <a className="download-cta download-cta-linux" href={clientZipUrl} download="Silent Client-5.0.zip">
              {text.downloadLinux}
              <span aria-hidden="true">↓</span>
            </a>
          </article>
        </div>
      </div>
    </section>
  )
}

const documentationTabs = {
  ru: [
    { id: 'ti', label: 'Ти' },
    { id: 'players', label: 'Игроки' },
    { id: 'chat', label: 'Чат' },
    { id: 'interface', label: 'Интерфейс' },
    { id: 'screen-world', label: 'Экран и Мир' },
    { id: 'textures', label: 'Текстуры' },
  ],
  en: [
    { id: 'ti', label: 'Tee' },
    { id: 'players', label: 'Players' },
    { id: 'chat', label: 'Chat' },
    { id: 'interface', label: 'Interface' },
    { id: 'screen-world', label: 'Screen & World' },
    { id: 'textures', label: 'Textures' },
  ],
}

const documentationContent = {
  ru: {
    ti: [
      { title: 'Радуга', items: [
        { title: 'Радуга своего ТИ', description: 'Цвет вашего ТИ становится радужным и переливается.' },
        { title: 'Радуга всех ТИ', description: 'Цвет ТИ других игроков становится радужным и переливается.' },
        { title: 'Красить ноги', description: 'Ноги вашего ТИ и других игроков становятся радужными и переливаются.' },
        { title: 'Искры вокруг своего ТИ', description: 'Вокруг вашего ТИ появляются искры.' },
        { title: 'Скорость радуги', description: 'Регулирует скорость переливания радуги на ТИ.' },
      ] },
      { title: 'Обводка', items: [
        { title: 'Обводка ТИ', description: 'Включает обводку вокруг вашего ТИ.' },
        { title: 'Толщина', description: 'Регулирует толщину обводки.' },
        { title: 'Цвет обводки', description: 'Позволяет выбрать цвет обводки ТИ.' },
      ] },
      { title: 'Образ ТИ', items: [
        { title: 'Размер ТИ', description: 'Регулирует размер вашего ТИ.' },
        { title: 'Положение молота', description: 'Выбирает расположение молота у вашего ТИ.' },
      ] },
      { title: 'Питомец', items: [
        { title: 'Питомец рядом с ТИ', description: 'Рядом с вашим ТИ летает маленький питомец и повторяет его движения.' },
        { title: 'Выбор питомца', description: 'Позволяет выбрать внешний вид питомца.' },
      ] },
      { title: 'Радужное оружие', items: [
        { title: 'Радужный молот', description: 'Цвет молота вашего ТИ становится радужным и переливается.' },
        { title: 'Скорость молота', description: 'Регулирует скорость переливания радуги на молоте.' },
        { title: 'Радужные пушки', description: 'Цвет пушек вашего ТИ становится радужным и переливается.' },
        { title: 'Скорость пушек', description: 'Регулирует скорость переливания радуги на пушках.' },
      ] },
      { title: 'След за ТИ', items: [
        { title: 'Выбор следа', description: 'Выбирает след, который будет тянуться за ТИ.' },
        { title: 'Длина следа', description: 'Регулирует длину следа.' },
      ] },
    ],
    players: [
      { title: 'Метки игроков', items: [
        { title: '!war', description: 'Отмечает враждебного игрока. По умолчанию его ник подсвечивается красным.' },
        { title: '!helper', description: 'Отмечает помощника. По умолчанию его ник подсвечивается жёлтым.' },
        { title: '!team', description: 'Отмечает друга. По умолчанию его ник подсвечивается зелёным.' },
        { title: '!unwar', description: 'Снимает с игрока метку !war.' },
        { title: '!unhelper', description: 'Снимает с игрока метку !helper.' },
        { title: '!unteam', description: 'Снимает с игрока метку !team.' },
        { title: '!unmark', description: 'Снимает с игрока метку.' },
        { title: '!mute', description: 'Скрывает сообщения игрока в чате.' },
        { title: '!unmute', description: 'Снимает с игрока метку !mute.' },
      ] },
      { title: 'Цвет подсветки', items: [
        { title: 'Цвета меток', description: 'Цвет подсветки меток !war, !helper и !team настраивается во вкладке «Чат».' },
      ] },
    ],
    chat: [
      { title: 'Автоответчик', items: [
        { title: 'Ответ на упоминание', description: 'Автоматически отвечает, когда вас упоминают в чате. Текст ответа вводится в специальное поле.' },
        { title: 'Ответ игрокам в муте', description: 'Автоматически отвечает игрокам с меткой !mute.' },
        { title: 'Сообщения из мута в F1', description: 'Показывает в консоли F1 сообщения игроков с меткой !mute.' },
      ] },
      { title: 'Заглушить', items: [
        { title: 'Управление мутом', description: 'Ставит или снимает метку !mute без команды в чате.' },
        { title: 'Цвета меток', description: 'Настраивает цвета меток !war, !helper и !team.' },
      ] },
      { title: 'Игроки вокруг тебя', items: [
        { title: 'Показывать индикаторы', description: 'Показывает вокруг вашего ТИ движущиеся эллипсы, указывающие положение ближайших игроков. Цвет зависит от метки игрока.' },
        { title: 'Количество', description: 'Регулирует максимальное количество индикаторов вокруг вашего ТИ.' },
        { title: 'Радиус', description: 'Регулирует расстояние индикаторов от вашего ТИ.' },
      ] },
    ],
    interface: [
      { title: 'HUD', items: [
        { title: 'Показывать HUD', description: 'Показывает игровые показатели: интерфейс, счёт и таймер.' },
        { title: 'Показывать FPS', description: 'Показывает количество кадров в секунду.' },
        { title: 'Показывать предикт', description: 'Показывает задержку в миллисекундах; это не пинг.' },
        { title: 'Показывать пинг', description: 'Показывает ваш пинг.' },
        { title: 'Показывать ID игроков', description: 'Показывает идентификатор игрока над его ТИ.' },
      ] },
      { title: 'DDRace', items: [
        { title: 'DDRace HUD', description: 'Показывает гоночный интерфейс: время, чекпоинты и другие показатели.' },
        { title: 'Позиция игрока', description: 'Показывает ваши координаты X и Y на карте.' },
        { title: 'Скорость игрока', description: 'Показывает горизонтальную и вертикальную скорость ТИ.' },
        { title: 'Угол прицела', description: 'Показывает угол, в направлении которого наведён курсор.' },
        { title: 'Полоски фриза', description: 'Показывает над замороженными ТИ время до разморозки.' },
      ] },
      { title: 'Колесо действий', items: [
        { title: 'Клавиша открытия', description: 'Выбирает клавишу, которая открывает колесо действий.' },
        { title: 'Ник', description: 'Копирует ник ближайшего к вам ТИ.' },
        { title: 'Скин и ник', description: 'Копирует скин и ник ближайшего к вам ТИ.' },
        { title: '!war, !helper и !team', description: 'Назначает ближайшему ТИ выбранную метку.' },
        { title: 'Заглушить', description: 'Ставит ближайшему ТИ метку !mute.' },
      ] },
      { title: 'Анимация колёс', items: [
        { title: 'Длительность', description: 'Регулирует длительность раскрытия колеса действий и колеса эмоций.' },
        { title: 'Плавность', description: 'Регулирует плавность анимации раскрытия колёс.' },
      ] },
      { title: 'Шрифты', items: [
        { title: 'Шрифт игры', description: 'Выбирает шрифт для всего текста в игре.' },
      ] },
    ],
    'screen-world': [
      { title: 'Формат экрана', items: [
        { title: 'Соотношение сторон', description: 'Выбирает формат экрана 4:3, 16:9 или 16:10.' },
        { title: 'Режим экрана', description: 'Выбирает режим отображения игры.' },
        { title: 'Применить', description: 'Сохраняет выбранные настройки экрана.' },
      ] },
      { title: 'Плавная камера', items: [
        { title: 'Время перехода', description: 'Настраивает длительность и плавность перехода камеры к следующему игроку в режиме наблюдателя.' },
      ] },
      { title: 'Карта', items: [
        { title: 'Фоновые квады', description: 'Показывает фоновые изображения карты.' },
        { title: 'Старые звёзды фриза', description: 'Включает прежний эффект звёзд у замороженных ТИ.' },
        { title: 'Индикатор прыжка в воздухе', description: 'Показывает, есть ли у ТИ двойной прыжок.' },
        { title: 'Оверлей энтити', description: 'Регулирует видимость игровых тайлов поверх карты.' },
      ] },
      { title: 'Другие игроки', items: [
        { title: 'Показывать других игроков', description: 'Показывает игроков, которые находятся в другой команде.' },
        { title: 'Прозрачность', description: 'Регулирует прозрачность игроков из другой команды.' },
      ] },
    ],
    textures: [
      { title: 'Текстуры Silent Client', items: [
        { title: 'Набор текстур', description: 'Выбирает текстуры Silent Client для игры.' },
      ] },
    ],
  },
  en: {
    ti: [
      { title: 'Rainbow', items: [
        { title: 'Rainbow Tee', description: 'Makes your Tee color cycle through a rainbow.' },
        { title: 'Rainbow all Tees', description: 'Makes other players’ Tees cycle through rainbow colors.' },
        { title: 'Color legs', description: 'Makes your Tee’s legs and other players’ legs cycle through rainbow colors.' },
        { title: 'Sparks around your Tee', description: 'Shows sparks around your Tee.' },
        { title: 'Rainbow speed', description: 'Adjusts how quickly the rainbow colors cycle on Tees.' },
      ] },
      { title: 'Outline', items: [
        { title: 'Tee outline', description: 'Enables an outline around your Tee.' },
        { title: 'Thickness', description: 'Adjusts the outline thickness.' },
        { title: 'Outline color', description: 'Chooses the Tee outline color.' },
      ] },
      { title: 'Tee appearance', items: [
        { title: 'Tee size', description: 'Adjusts the size of your Tee.' },
        { title: 'Hammer position', description: 'Chooses where the hammer appears on your Tee.' },
      ] },
      { title: 'Pet', items: [
        { title: 'Pet next to Tee', description: 'A small pet flies beside your Tee and follows its movement.' },
        { title: 'Choose a pet', description: 'Chooses how your pet looks.' },
      ] },
      { title: 'Rainbow weapons', items: [
        { title: 'Rainbow hammer', description: 'Makes your Tee’s hammer cycle through rainbow colors.' },
        { title: 'Hammer speed', description: 'Adjusts the rainbow cycle speed on the hammer.' },
        { title: 'Rainbow guns', description: 'Makes your Tee’s guns cycle through rainbow colors.' },
        { title: 'Gun speed', description: 'Adjusts the rainbow cycle speed on guns.' },
      ] },
      { title: 'Tee trail', items: [
        { title: 'Choose a trail', description: 'Selects the trail that follows your Tee.' },
        { title: 'Trail length', description: 'Adjusts the length of the trail.' },
      ] },
    ],
    players: [
      { title: 'Player marks', items: [
        { title: '!war', description: 'Marks a hostile player. Their name glows red by default.' },
        { title: '!helper', description: 'Marks a helper. Their name glows yellow by default.' },
        { title: '!team', description: 'Marks a friend. Their name glows green by default.' },
        { title: '!unwar', description: 'Removes the !war mark from a player.' },
        { title: '!unhelper', description: 'Removes the !helper mark from a player.' },
        { title: '!unteam', description: 'Removes the !team mark from a player.' },
        { title: '!unmark', description: 'Removes a player mark.' },
        { title: '!mute', description: 'Hides the player’s chat messages.' },
        { title: '!unmute', description: 'Removes the !mute mark from a player.' },
      ] },
      { title: 'Highlight colors', items: [
        { title: 'Mark colors', description: 'Configure the !war, !helper, and !team highlight colors in the Chat tab.' },
      ] },
    ],
    chat: [
      { title: 'Auto-reply', items: [
        { title: 'Reply to mentions', description: 'Automatically replies when someone mentions you in chat. Enter the reply in the dedicated field.' },
        { title: 'Reply to muted players', description: 'Automatically replies to players marked with !mute.' },
        { title: 'Muted messages in F1', description: 'Shows messages from players marked with !mute in the F1 console.' },
      ] },
      { title: 'Mute', items: [
        { title: 'Mute controls', description: 'Adds or removes the !mute mark without using a chat command.' },
        { title: 'Mark colors', description: 'Sets the colors for !war, !helper, and !team marks.' },
      ] },
      { title: 'Players around you', items: [
        { title: 'Show indicators', description: 'Shows moving ellipses around your Tee to indicate nearby players. Their color depends on each player’s mark.' },
        { title: 'Count', description: 'Sets the maximum number of indicators around your Tee.' },
        { title: 'Radius', description: 'Adjusts how far the indicators appear from your Tee.' },
      ] },
    ],
    interface: [
      { title: 'HUD', items: [
        { title: 'Show HUD', description: 'Shows game information such as the interface, score, and timer.' },
        { title: 'Show FPS', description: 'Shows frames per second.' },
        { title: 'Show prediction', description: 'Shows prediction delay in milliseconds; this is not ping.' },
        { title: 'Show ping', description: 'Shows your ping.' },
        { title: 'Show player IDs', description: 'Shows each player’s ID above their Tee.' },
      ] },
      { title: 'DDRace', items: [
        { title: 'DDRace HUD', description: 'Shows race information such as time and checkpoints.' },
        { title: 'Player position', description: 'Shows your X and Y coordinates on the map.' },
        { title: 'Player speed', description: 'Shows the Tee’s horizontal and vertical speed.' },
        { title: 'Aim angle', description: 'Shows the angle your cursor is pointing toward.' },
        { title: 'Freeze bars', description: 'Shows how long frozen Tees have left until they are unfrozen.' },
      ] },
      { title: 'Action wheel', items: [
        { title: 'Open key', description: 'Chooses the key that opens the action wheel.' },
        { title: 'Nickname', description: 'Copies the nickname of the nearest Tee.' },
        { title: 'Skin and nickname', description: 'Copies the skin and nickname of the nearest Tee.' },
        { title: '!war, !helper, and !team', description: 'Applies the selected mark to the nearest Tee.' },
        { title: 'Mute', description: 'Applies the !mute mark to the nearest Tee.' },
      ] },
      { title: 'Wheel animation', items: [
        { title: 'Duration', description: 'Adjusts how long the action and emote wheels take to open.' },
        { title: 'Smoothness', description: 'Adjusts the opening animation smoothness.' },
      ] },
      { title: 'Fonts', items: [
        { title: 'Game font', description: 'Chooses the font used for all in-game text.' },
      ] },
    ],
    'screen-world': [
      { title: 'Screen format', items: [
        { title: 'Aspect ratio', description: 'Chooses 4:3, 16:9, or 16:10.' },
        { title: 'Screen mode', description: 'Chooses the display mode.' },
        { title: 'Apply', description: 'Saves the selected screen settings.' },
      ] },
      { title: 'Smooth camera', items: [
        { title: 'Transition time', description: 'Adjusts the duration and smoothness of camera transitions to the next player while spectating.' },
      ] },
      { title: 'Map', items: [
        { title: 'Background quads', description: 'Shows the map’s background images.' },
        { title: 'Old freeze stars', description: 'Enables the old star effect on frozen Tees.' },
        { title: 'Air jump indicator', description: 'Shows whether a Tee has a double jump available.' },
        { title: 'Entity overlay', description: 'Adjusts how visible game tiles are over the map.' },
      ] },
      { title: 'Other players', items: [
        { title: 'Show other players', description: 'Shows players who are in another team.' },
        { title: 'Opacity', description: 'Adjusts the opacity of players in another team.' },
      ] },
    ],
    textures: [
      { title: 'Silent Client textures', items: [
        { title: 'Texture pack', description: 'Chooses the Silent Client textures used in game.' },
      ] },
    ],
  },
}

function DocumentationTabIcon({ name }) {
  const icon = {
    ti: <><circle cx="12" cy="8" r="3" /><path d="M5.5 20c.8-3.2 3-4.8 6.5-4.8s5.7 1.6 6.5 4.8" /></>,
    players: <><circle cx="9" cy="8" r="2.7" /><path d="M3.8 19c.5-2.8 2.2-4.2 5.2-4.2 1.3 0 2.4.3 3.2.9M16 5.5a2.8 2.8 0 0 1 0 5.5m1.2 3.7c1.8.6 2.8 2 3.1 4.3" /></>,
    chat: <><path d="M4 5.5h16v11H9l-5 3v-14Z" /><path d="M8 10h8m-8 3h5" /></>,
    interface: <><rect x="4" y="4.5" width="16" height="15" rx="2" /><path d="M4 9h16M9 9v10.5" /></>,
    'screen-world': <><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8m-4-4v4" /></>,
    textures: <><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M4 10h16M4 15h16M10 4v16M15 4v16" /></>,
  }[name]

  return (
    <svg className="docs-tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {icon}
    </svg>
  )
}

function SimpleShowcase({ items, text }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const touchStart = useRef(null)
  const item = items[activeIndex]
  const itemCount = items.length
  const move = direction => setActiveIndex(index => (index + direction + itemCount) % itemCount)
  const startSwipe = event => {
    const touch = event.touches[0]
    touchStart.current = { x: touch.clientX, y: touch.clientY }
  }
  const finishSwipe = event => {
    const start = touchStart.current
    touchStart.current = null
    if (!start) return
    const touch = event.changedTouches[0]
    const deltaX = touch.clientX - start.x
    const deltaY = touch.clientY - start.y
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.25) move(deltaX < 0 ? 1 : -1)
  }

  return (
    <div className="simple-showcase" role="region" aria-roledescription="carousel" aria-label={text.showcaseLabel}>
      <figure className="simple-showcase-figure" aria-live="polite">
        <div className="simple-showcase-media" onTouchStart={startSwipe} onTouchEnd={finishSwipe} onTouchCancel={() => { touchStart.current = null }}>
          <img src={item.image} alt={`${item.title}. ${item.description}`} loading="lazy" decoding="async" />
        </div>
        <figcaption className="simple-showcase-caption">
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </figcaption>
      </figure>
      <div className="simple-showcase-controls">
        <button type="button" aria-label={text.previousSlide} onClick={() => move(-1)}>‹</button>
        <div className="simple-showcase-indicators" role="group" aria-label={text.showcaseLabel}>
          {items.map((slide, index) => (
            <button
              key={slide.title}
              type="button"
              className={index === activeIndex ? 'is-active' : ''}
              aria-label={`${text.slide} ${index + 1}: ${slide.title}`}
              aria-current={index === activeIndex ? 'true' : undefined}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
        <button type="button" aria-label={text.nextSlide} onClick={() => move(1)}>›</button>
      </div>
    </div>
  )
}

function DocumentationPage({ language, text, simplifiedExperience }) {
  const [activeTab, setActiveTab] = useState('silent')
  const [silentExpanded, setSilentExpanded] = useState(true)
  const tabs = documentationTabs[language]

  const selectSilent = () => {
    if (activeTab === 'silent') {
      setSilentExpanded(expanded => !expanded)
      return
    }
    setActiveTab('silent')
    setSilentExpanded(true)
  }

  return (
    <section className="docs-page" aria-labelledby="docs-title">
      {!simplifiedExperience && (
        <Suspense fallback={null}>
          <GhostCursor color="#ef3340" trailLength={24} inertia={0.58} brightness={0.68} bloomStrength={0.06} zIndex={0} />
        </Suspense>
      )}
      <div className="docs-container">
        <header className="docs-intro">
          <h1 id="docs-title" className="docs-title">{text.documentation}</h1>
        </header>

        <div className="docs-layout">
          <aside className="docs-sidebar" aria-label={text.docsSidebarLabel}>
            <p className="docs-sidebar-label">{text.docsSidebarLabel}</p>
            <button
              type="button"
              className={`docs-category${activeTab === 'silent' ? ' is-active' : ''}`}
              aria-expanded={silentExpanded}
              aria-pressed={activeTab === 'silent'}
              aria-controls="silent-docs-tabs"
              onClick={selectSilent}
            >
              <span className="docs-category-label">
                <span className="docs-category-mark" aria-hidden="true">✦</span>
                <span>Silent</span>
              </span>
              <svg className={`docs-category-chevron${silentExpanded ? ' is-expanded' : ''}`} viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="m4 6 4 4 4-4" />
              </svg>
            </button>
            <nav id="silent-docs-tabs" className="docs-tab-list" aria-label={text.docsNavigationLabel} hidden={!silentExpanded}>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  className={`docs-tab${activeTab === tab.id ? ' is-active' : ''}`}
                  aria-pressed={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <DocumentationTabIcon name={tab.id} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </aside>

          <article className="docs-main" aria-live="polite">
            {activeTab === 'silent'
              ? (
                <div className="docs-settings-location">
                  <p>{text.settingsLocationIntro}</p>
                  <p className="docs-settings-path">{text.settingsLocation}</p>
                </div>
              )
              : (
                <>
                  <h2 className="docs-content-title">{tabs.find(tab => tab.id === activeTab)?.label}</h2>
                  <div className="docs-card-grid">
                    {documentationContent[language][activeTab].map(group => (
                      <section className="docs-content-card" key={group.title}>
                        <h3>{group.title}</h3>
                        <div className="docs-feature-list">
                          {group.items.map(item => (
                            <div className="docs-feature-row" key={item.title}>
                              <h4>{item.title}</h4>
                              <p>{item.description}</p>
                            </div>
                          ))}
                        </div>
                      </section>
                    ))}
                  </div>
                </>
              )}
          </article>
        </div>
      </div>
    </section>
  )
}

function App() {
  const simplifiedExperience = useMediaQuery('(max-width: 860px), (pointer: coarse), (prefers-reduced-motion: reduce)')
  const [language, setLanguageState] = useState(() => languageFromPath(window.location.pathname))
  const [showcaseReady, setShowcaseReady] = useState(false)
  const text = translations[language]
  const currentPath = normalizedPath(window.location.pathname)
  const isDownloadPage = Object.values(pagePaths.download).includes(currentPath)
  const isDocumentationPage = Object.values(pagePaths.documentation).includes(currentPath)
  const isSubpage = isDownloadPage || isDocumentationPage
  const homePageUrl = localizedPageUrl(language)
  const downloadPageUrl = localizedPageUrl(language, 'download')
  const documentationPageUrl = localizedPageUrl(language, 'documentation')
  const seoPageKey = isDownloadPage ? 'download' : isDocumentationPage ? 'documentation' : 'home'
  const seo = seoCopy[language][seoPageKey]
  const setLanguage = nextLanguage => {
    const route = isDownloadPage ? 'download' : isDocumentationPage ? 'documentation' : ''
    const hash = route ? '' : window.location.hash
    window.history.pushState({}, '', `${localizedPageUrl(nextLanguage, route)}${hash}`)
    setLanguageState(nextLanguage)
  }

  useEffect(() => {
    let firstFrame = 0
    let secondFrame = 0
    let removalTimer = 0

    firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => {
        document.getElementById('root')?.classList.add('is-ready')
        const bootScreen = document.getElementById('boot-screen')
        bootScreen?.classList.add('is-hidden')
        removalTimer = window.setTimeout(() => bootScreen?.remove(), 320)
      })
    })

    return () => {
      cancelAnimationFrame(firstFrame)
      cancelAnimationFrame(secondFrame)
      window.clearTimeout(removalTimer)
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = language
    try {
      window.localStorage.setItem('silent-client-language', language)
    } catch {}
  }, [language])

  useEffect(() => {
    const syncLanguageWithPath = () => setLanguageState(languageFromPath(window.location.pathname))
    window.addEventListener('popstate', syncLanguageWithPath)
    return () => window.removeEventListener('popstate', syncLanguageWithPath)
  }, [])

  useEffect(() => {
    const showcase = document.querySelector('.showcase')
    if (!showcase) return undefined

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShowcaseReady(true)
        observer.disconnect()
      }
    }, { rootMargin: '320px 0px' })

    observer.observe(showcase)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    document.title = seo.title

    const setMetaContent = (selector, content) => {
      document.head.querySelector(selector)?.setAttribute('content', content)
    }
    const baseUrl = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`
    const canonicalUrl = new URL(localizedPageUrl(language, seoPageKey === 'home' ? '' : seoPageKey), window.location.origin).href
    const socialImageUrl = new URL(`${baseUrl}social-card.svg`, window.location.origin).href
    let canonical = document.head.querySelector('link[rel="canonical"]')

    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.append(canonical)
    }

    canonical.href = canonicalUrl
    for (const [locale, localeCode] of [['ru', 'ru'], ['en', 'en'], ['x-default', 'ru']]) {
      const alternatePath = localizedPageUrl(localeCode, seoPageKey === 'home' ? '' : seoPageKey)
      const alternateUrl = new URL(alternatePath, window.location.origin).href
      let alternate = document.head.querySelector(`link[rel="alternate"][hreflang="${locale}"]`)
      if (!alternate) {
        alternate = document.createElement('link')
        alternate.rel = 'alternate'
        alternate.hreflang = locale
        document.head.append(alternate)
      }
      alternate.href = alternateUrl
    }
    setMetaContent('meta[name="description"]', seo.description)
    setMetaContent('meta[property="og:title"]', seo.title)
    setMetaContent('meta[property="og:description"]', seo.description)
    setMetaContent('meta[property="og:url"]', canonicalUrl)
    setMetaContent('meta[property="og:image"]', socialImageUrl)
    setMetaContent('meta[property="og:image:alt"]', seo.title)
    setMetaContent('meta[property="og:locale"]', language === 'ru' ? 'ru_RU' : 'en_US')
    setMetaContent('meta[name="twitter:title"]', seo.title)
    setMetaContent('meta[name="twitter:description"]', seo.description)
    setMetaContent('meta[name="twitter:image"]', socialImageUrl)
    setMetaContent('meta[name="twitter:image:alt"]', seo.title)
  }, [language, seo, seoPageKey])

  return (
    <>
      <Header language={language} setLanguage={setLanguage} text={text} isDownloadPage={isDownloadPage} isDocumentationPage={isDocumentationPage} />
      <main>
        {isDownloadPage ? <DownloadPage text={text} /> : isDocumentationPage ? <DocumentationPage language={language} text={text} simplifiedExperience={simplifiedExperience} /> : (
          <>
        <section className="hero" id="home" aria-labelledby="hero-title">
          <div className="hero-background" aria-hidden="true" />
          <div className="ring-layer" aria-hidden="true">
            {!simplifiedExperience && (
              <Suspense fallback={null}>
                <MagicRings
                  color="#ff2938"
                  colorTwo="#8f101e"
                  ringCount={6}
                  speed={0.5}
                  attenuation={9}
                  lineThickness={2}
                  baseRadius={0.34}
                  radiusStep={0.105}
                  scaleRate={0.1}
                  opacity={0.83}
                  noiseAmount={0.055}
                  ringGap={1.48}
                  fadeIn={0.75}
                  fadeOut={0.48}
                  followMouse
                  mouseInfluence={0.12}
                  hoverScale={1.08}
                  parallax={0.04}
                  clickBurst
                />
              </Suspense>
            )}
          </div>

          <div className="hero-content">
            <img className="hero-logo" src={logoUrl} alt="" />
            <h1 id="hero-title" className="hero-title">Silent Client</h1>
          </div>
        </section>

        <section id="showcase" className="showcase" aria-labelledby="showcase-title">
          <div className="showcase-content">
            <h2 id="showcase-title" className="showcase-title">{text.showcaseTitle}</h2>
            {simplifiedExperience
              ? <SimpleShowcase items={showcaseItems[language]} text={text} />
              : (
                <div className="morph-slider-shell">
                  {showcaseReady && (
                    <Suspense fallback={null}>
                      <MorphSlider
                        items={showcaseItems[language]}
                        className="h-full w-full"
                        transition="melt"
                        duration={1.1}
                        radius="inherit"
                        fit="contain"
                        overlayColor="#16080b"
                        showCaptions
                        showIndicators
                        indicatorPlacement="below"
                      />
                    </Suspense>
                  )}
                </div>
              )}
          </div>
        </section>
          </>
        )}
      </main>
      <footer className="footer">
        <div className="footer-brand">
          <a className="footer-wordmark" href={homePageUrl} aria-label={text.homeLabel}>
            <img className="footer-logo" src={logoUrl} alt="" />
            <span>Silent Client</span>
          </a>
          <p className="footer-copyright">© {new Date().getFullYear()} Silent Client<br />{text.rights}</p>
        </div>

        <div className="footer-links">
          <div className="footer-column">
            <h2 className="footer-heading">{text.footerPlatform}</h2>
            <a href={isSubpage ? homePageUrl : '#home'}>{text.home}</a>
            <a href={downloadPageUrl}>{text.download}</a>
            <a href={isSubpage ? `${homePageUrl}#showcase` : '#showcase'}>{text.overview}</a>
            <a href={documentationPageUrl}>{text.documentation}</a>
          </div>

          <div className="footer-column">
            <h2 className="footer-heading">{text.footerCommunity}</h2>
            <a className="footer-github" href="https://github.com/Morrro16" target="_blank" rel="noopener noreferrer" aria-label="GitHub Morrro16">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.08c-3.1.68-3.76-1.32-3.76-1.32-.5-1.3-1.24-1.65-1.24-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.73 1.16 1.73 1.16 1 .1.76 2.6 4.18 1.84.1-.73.4-1.23.72-1.51-2.48-.28-5.08-1.24-5.08-5.52 0-1.22.44-2.22 1.16-3-.12-.29-.5-1.43.11-2.98 0 0 .95-.3 3.05 1.15a10.6 10.6 0 0 0 5.56 0c2.1-1.43 3.04-1.15 3.04-1.15.61 1.55.23 2.69.11 2.98.72.78 1.15 1.78 1.15 3 0 4.29-2.6 5.24-5.09 5.52.4.35.76 1.02.76 2.06v3.05c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" /></svg>
              <span>Morrro16</span>
            </a>
          </div>

          <div className="footer-column">
            <h2 className="footer-heading">{text.footerCreator}</h2>
            <span className="footer-credit">Moro</span>
          </div>
        </div>
      </footer>
    </>
  )
}

export default App
