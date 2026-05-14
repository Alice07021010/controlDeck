# Control Deck React

Веб-приложение на React/Vite с тёмной панелью управления компьютерными клубами: дашборд, бронирования, смены, финансы, персонал, карта станций, регистрация и удалённое управление станцией.

## Технологии

- React
- Vite
- JavaScript
- CSS
- GitHub Actions
- GitHub Pages / Vercel / Netlify

## Локальный запуск

```bash
npm install
npm run dev
```

После запуска приложение будет доступно по адресу:

```bash
http://localhost:5173
```

## Сборка проекта

```bash
npm run build
```

Готовая production-сборка создаётся в папке `dist`.

## Предпросмотр production-сборки

```bash
npm run preview
```

## Доступные экраны

- `#/dashboard` — главный экран
- `#/flows` — бронирования и потоки
- `#/shifts` — смены
- `#/finance` — финансы
- `#/staff` — персонал
- `#/map` — карта станций
- `#/register` — регистрация
- `#/remote` — удалённое управление станцией

## Деплой через GitHub Pages и CI/CD

В проект добавлен workflow `.github/workflows/deploy.yml`.

Он автоматически выполняет следующие действия при каждом `push` в ветку `main`:

1. Загружает код из репозитория.
2. Устанавливает Node.js.
3. Устанавливает зависимости командой `npm ci`.
4. Собирает проект командой `npm run build`.
5. Публикует папку `dist` на GitHub Pages.

Чтобы включить деплой:

1. Загрузить проект в GitHub.
2. Открыть репозиторий на GitHub.
3. Перейти в `Settings` → `Pages`.
4. В разделе `Build and deployment` выбрать `Source: GitHub Actions`.
5. Сделать новый коммит и выполнить `git push origin main`.
6. Открыть вкладку `Actions` и дождаться успешного выполнения workflow.

После этого GitHub выдаст ссылку на опубликованный сайт.

## Деплой через Vercel

Настройки для Vercel уже добавлены в `vercel.json`.

Параметры:

- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`

После подключения репозитория Vercel будет автоматически пересобирать сайт при новых коммитах.

## Деплой через Netlify

Настройки для Netlify уже добавлены в `netlify.toml`.

Параметры:

- Build command: `npm run build`
- Publish directory: `dist`

После подключения GitHub-репозитория Netlify будет автоматически обновлять сайт при новых коммитах.

## Что не нужно загружать в GitHub

В репозиторий не нужно загружать:

- `node_modules/`
- `dist/`
- `.env`
- временные файлы редактора

Эти файлы исключены через `.gitignore`.
