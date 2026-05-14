import React, { useMemo, useState } from 'react';

const nav = [
  { id: 'dashboard', label: 'Дашборд' },
  { id: 'flows', label: 'Потоки' },
  { id: 'shifts', label: 'Смены' },
  { id: 'finance', label: 'Финансы' },
  { id: 'staff', label: 'Персонал' },
  { id: 'map', label: 'Карта станций' },
];

const stationGroups = [
  {
    title: 'Зал RTX',
    stations: [
      ['RTX-01', 'free'], ['RTX-02', 'busy'], ['RTX-03', 'free'], ['RTX-04', 'booked'],
      ['RTX-05', 'busy'], ['RTX-06', 'busy'], ['RTX-07', 'free'], ['RTX-08', 'off'],
    ],
  },
  {
    title: 'VR Зал',
    stations: [['VR-01', 'busy'], ['VR-02', 'busy'], ['VR-03', 'free'], ['VR-04', 'booked'], ['VR-05', 'off']],
  },
  {
    title: 'Зал Shubk',
    stations: [['SHUBK-01', 'free'], ['SHUBK-02', 'free'], ['SHUBK-03', 'booked'], ['SHUBK-04', 'busy'], ['SHUBK-05', 'free']],
  },
  {
    title: 'Studio Зал',
    stations: [['STUDIO-01', 'booked'], ['STUDIO-02', 'busy'], ['STUDIO-03', 'busy'], ['STUDIO-04', 'free'], ['STUDIO-05', 'free'], ['STUDIO-06', 'off']],
  },
];

const planCells = ['RTX 01', 'RTX 02', 'RTX 03', 'RTX 04', 'RTX 05', 'RTX 06', 'RTX 07', 'RTX 08', 'VR 01', 'VR 02', 'Studio 01', 'Studio 02'];
const people = [
  { initials: 'ОП', name: 'Ольга П.', email: 'olga@club.ru · Москва · Центр', role: 'Администратор', location: 'Москва · Центр' },
  { initials: 'АМ', name: 'Андрей М.', email: 'andrey@club.ru · СПБ · Невский', role: 'Техник', location: 'СПБ · Невский' },
  { initials: 'ДК', name: 'Дмитрий К.', email: 'dmitry@club.ru · Москва · Центр', role: 'Кассир', location: 'Москва · Центр' },
];
const roles = [
  { icon: 'A', title: 'Администратор', desc: 'Управление залами и бронированиями', access: 'CRUD брони, инциденты' },
  { icon: 'T', title: 'Техник', desc: 'Диагностика и обновления оборудования', access: 'Инциденты, карты залов' },
  { icon: 'K', title: 'Кассир', desc: 'Оплаты, чеки и возвраты', access: 'Финансы: продажи, возвраты' },
];
const shifts = [
  ['Ольга П.', 'Администратор', 'Москва · Центр', '10:00–18:00'],
  ['Андрей М.', 'Техник', 'СПБ · Невский', '14:00–22:00'],
  ['Дмитрий К.', 'Кассир', 'Москва · Центр', '18:00–02:00'],
];
const bookings = [
  ['Иван К.', 'RTX-12', 'Arena', '18:00–19:30', 'Ожидают'],
  ['Команда Neon', 'Studio-4', 'Studio', '19:00–21:00', 'Активно'],
  ['Мария С.', 'VR-02', 'VR', '20:00–21:00', 'Ожидают'],
];
const financeRows = [
  ['Casual · почасовой', 'Базовый почасовой тариф для разовых посещений.', '249 ₽/ч', '—'],
  ['Pro Stream · почасовой', 'Расширенный тариф для стримеров и длительных сессий.', '429 ₽/ч', '—'],
  ['VIP Месяц', 'Месячная подписка с приоритетным бронированием.', '2 990 ₽', '1 012'],
];

function App() {
  const [page, setPage] = useHashPage();
  const [modal, setModal] = useState(null);

  if (page === 'login') return <LoginPage setPage={setPage} />;
if (page === 'register') return <RegisterPage setPage={setPage} />;
if (page === 'remote') return <RemotePage setPage={setPage} />;
  return (
    <div className="app-shell">
      <Header page={page} setPage={setPage} setModal={setModal} />
      <main className={`page page-${page}`}>
        {page === 'dashboard' && <Dashboard setPage={setPage} setModal={setModal} />}
        {page === 'flows' && <Flows setModal={setModal} />}
        {page === 'shifts' && <Shifts setModal={setModal} />}
        {page === 'finance' && <Finance setModal={setModal} />}
        {page === 'staff' && <Staff setModal={setModal} />}
        {page === 'map' && <StationMap setModal={setModal} />}
      </main>
      {modal && <Modal type={modal} close={() => setModal(null)} />}
    </div>
  );
}

function useHashPage() {
  const get = () => (window.location.hash || '#/login').replace('#/', '');
  const [page, setPageState] = useState(get);
  React.useEffect(() => {
    const handler = () => setPageState(get());
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);
  const setPage = (next) => {
    window.location.hash = `#/${next}`;
    setPageState(next);
  };
  return [page, setPage];
}

function Header({ page, setPage, setModal }) {
  const title = {
    dashboard: 'Сеть клубов · 5 площадок', flows: 'Бронирования и сеансы', shifts: 'Смены и персонал',
    finance: 'Финансы и подписки', staff: 'Персонал', map: 'Карта станций',
  }[page];
  return (
    <header className="topbar">
      <div className="header-row">
        <div className="brand" onClick={() => setPage('dashboard')}>{page === 'staff' || page === 'finance' ? 'CONTROL DECK' : 'НАЗВАНИЕ'}</div>
        <div className="header-title">{title}</div>
        {page === 'dashboard' && (
          <div className="header-actions">
            <button className="ghost-btn" onClick={() => setPage('register')}>Экспорт</button>
            <button className="primary-btn" onClick={() => setModal('addClub')}>Добавить клуб</button>
          </div>
        )}
      </div>
      <nav className="nav-line">
        {nav.map((item) => (
          <button key={item.id} onClick={() => setPage(item.id)} className={page === item.id ? 'active' : ''}>
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  );
}

function StatCard({ label, value, sub, icon }) {
  return (
    <section className="stat-card">
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{sub}</small>
      </div>
      {icon && <i>{icon}</i>}
    </section>
  );
}

function Dashboard({ setPage, setModal }) {
  return (
    <div className="container wide dashboard-grid">
      <div className="stats-row">
        <StatCard label="Загрузка станций" value="84%" sub="+6% к прошлому часу" />
        <StatCard label="Выручка сегодня" value="734 200 ₽" sub="+12% к среднему" />
        <StatCard label="Инциденты" value="5" sub="-3 решено за час" />
        <StatCard label="Подписки активны" value="1 420" sub="+32 за день" />
      </div>
      <section className="panel plan-card">
        <div className="panel-title-row">
          <h2>План залов</h2><span className="pill">5 локаций онлайн</span>
        </div>
        <div className="station-plan">
          {planCells.map((cell, index) => (
            <button key={cell} onClick={() => (cell === 'RTX 05' ? setPage('remote') : null)} className={`plan-cell ${index % 3 === 0 ? 'selected' : ''}`}>{cell}</button>
          ))}
        </div>
      </section>
      <section className="panel active-table">
        <div className="panel-title-row">
          <h2>Активные станции</h2><button className="tiny-btn" onClick={() => setModal('activeStations')}>Смотреть все</button>
        </div>
        <DataTable columns={['Станция', 'Клиент', 'Зал', 'Статус']} rows={[
          ['RTX-18', 'Владимир C.', 'Центр · Arena', <Badge type="green">Играет · 37 мин</Badge>],
          ['Studio-3', 'Команда Neon', 'СПБ · Studio', <Badge type="blue">Рендер · 82%</Badge>],
          ['VR-02', 'Свободно', 'Екат · VR', <Badge type="yellow">Диагностика</Badge>],
        ]} />
      </section>
      <section className="panel log-card">
        <div className="panel-title-row"><h2>Журнал событий</h2><span>Live stream</span></div>
        <Timeline items={[
          ['16:32', 'Администратор Ольга продлила абонемент «VIP» на станции RTX-10... 12'],
          ['16:05', 'Автоматика завершила обновление CS2 · Москва Центр · 18 машин'],
          ['15:58', 'Техник Андрей закрыл инцидент VR-02 · заменён кабель DisplayPort'],
        ]} />
      </section>
      <section className="panel task-card">
        <div className="panel-title-row"><h2>Задачи персонала</h2><span className="pill">4 открыто</span></div>
        {['Проверить VR-зал', 'Акция «Ночь CS2»', 'Инвентаризация'].map((t, i) => (
          <button key={t} className="task-item" onClick={() => setModal('staffTask')}>
            <strong>{t}</strong><span>{i === 0 ? 'Контролировать трекинг на станциях VR-02/03' : i === 1 ? 'Пересчитать ПКМ и настроить бронирования' : 'Отсканировать оборудование зала Studio'}</span>
          </button>
        ))}
      </section>
    </div>
  );
}

function StationMap({ setModal }) {
  return (
    <div className="container compact map-wrap">
      <section className="panel map-panel">
        <div className="panel-title-row map-head">
          <div><h2>Карта станций</h2><p>Группировка по залам и быстрые фильтры статусов</p></div>
          <div className="filter-pills"><button className="on">Все</button><button>Свободные</button><button>Занятые</button><button>Забронированные</button></div>
        </div>
        <div className="station-grid-groups">
          {stationGroups.map((group) => <StationGroup key={group.title} group={group} />)}
        </div>
        <div className="bottom-actions">
          <button className="primary-btn" onClick={() => setModal('addStation')}>Добавить станцию</button>
          <div className="legend">
            <span><b className="free" />Свободно</span><span><b className="busy" />Занято</span><span><b className="booked" />Забронировано</span><span><b className="off" />Неактивно</span>
          </div>
        </div>
      </section>
      <section className="panel activity-panel">
        <h2>Последняя активность</h2><p>Что происходило со станциями в последнее время</p>
        <Timeline items={[
          ['16:30', <><strong>RTX-04 перешла в статус «Забронировано»</strong><span>Бронь создана на 18:00–19:30 для клиента Иван К.</span></>],
          ['16:12', <><strong>VR-03 снова свободна</strong><span>Сеанс завершён, оборудование готово к новой сессии.</span></>],
          ['15:55', <><strong>SHUBK-04 временно отключена</strong><span>Поставлена на диагностику после инцидента с питанием.</span></>],
        ]} />
      </section>
      <section className="panel stats-stack">
        <h2>Статистика</h2>
        {[
          ['24', 'Всего станций', '+2 за неделю', 'cyan'], ['9', 'Свободно', '+5 за час', 'green'], ['8', 'Занято', '-3 за час', 'pink'], ['4', 'Забронировано', '+2 за день', 'yellow'],
        ].map(([a,b,c,t]) => <MiniStat key={b} value={a} label={b} sub={c} type={t} />)}
      </section>
    </div>
  );
}

function StationGroup({ group }) {
  return (
    <section className="station-group">
      <h3><span>▣</span>{group.title}</h3>
      <div className="station-cards">
        {group.stations.map(([name, status]) => <button key={name} className={`station-card ${status}`}>{name}</button>)}
      </div>
    </section>
  );
}

function MiniStat({ value, label, sub, type }) {
  return <div className={`mini-stat ${type}`}><strong>{value}</strong><span>{label}</span><small>{sub}</small></div>;
}

function Flows({ setModal }) {
  return (
    <div className="container wide flow-grid">
      <div className="stats-row small-stats">
        <StatCard label="Активные брони" value="24" sub="+6%" icon="⦿" />
        <StatCard label="Ожидают" value="7" sub="+2" icon="◌" />
        <StatCard label="Свободные слоты" value="11" sub="до 22:00" icon="◍" />
        <StatCard label="Средняя загрузка" value="84%" sub="+9%" icon="◔" />
      </div>
      <section className="panel filter-row flow-filter">
        <FakeSelect label="Все площадки" /><FakeSelect label="Все залы" /><FakeSelect label="Статус" />
        <input placeholder="Поиск по клиенту / станции" />
        <button className="primary-btn" onClick={() => setModal('createBooking')}>Создать бронь</button>
      </section>
      <section className="panel bookings-card">
        <div className="panel-title-row"><div><h2>Ближайшие бронирования</h2><p>Все текущие заявки с быстрыми действиями по подтверждению и открытию сеанса</p></div><span className="pill">Live queue</span></div>
        <DataTable columns={['Клиент','Станция','Зал','Время','Статус','Действие']} rows={bookings.map((r) => [r[0], r[1], r[2], r[3], <Badge type={r[4] === 'Активно' ? 'green' : 'yellow'}>{r[4]}</Badge>, <button className="row-btn">{r[4] === 'Активно' ? 'Открыть' : 'Подтвердить'}</button>])} />
      </section>
      <section className="panel queue-card">
        <div className="panel-title-row"><div><h2>Очередь ожидания</h2><p>Клиенты и группы, которых можно быстро перевести в доступный слот</p></div><span className="pill">3 в очереди</span></div>
        {['Арсений · 1 чел · Arena', 'Группа CS2 · 5 чел · Arena', 'Егор · VR'].map((title, i) => (
          <div className="queue-item" key={title}><div><strong>{title}</strong><span>{i === 0 ? 'Просит ближайший слот сегодня после 19:00' : i === 1 ? 'Нужно объединить рядом стоящие станции' : 'Ждёт освобождения VR-02 или VR-03'}</span></div><button className="ghost-btn">Назначить</button></div>
        ))}
      </section>
    </div>
  );
}

function Shifts({ setModal }) {
  return (
    <div className="container wide shifts-grid">
      <section className="panel filter-row shifts-filter">
        <FakeSelect label="Локация" /><FakeSelect label="Роль" /><FakeSelect label="Смена" />
        <input placeholder="Поиск по имени" />
        <button className="primary-btn" onClick={() => setModal('assignShift')}>Назначить смену</button>
      </section>
      <section className="panel schedule-card">
        <h2>Расписание смен</h2><p>Текущие сотрудники по локациям, ролям и времени работы</p>
        <DataTable columns={['Сотрудник','Роль','Локация','Время','Действие']} rows={shifts.map((row) => [row[0], <Badge type="blue">{row[1]}</Badge>, row[2], row[3], <button className="row-btn" onClick={() => setModal('editShift')}>Изменить</button>])} />
      </section>
      <section className="panel shift-tasks">
        <div className="panel-title-row"><div><h2>Задачи смены</h2><p>Операционные задачи для распределения по команде</p></div><span className="pill">3 активные</span></div>
        {['Проверка VR-оборудования', 'Инвентаризация Studio', 'Подготовка акции «Ночь CS2»'].map((title, index) => (
          <div className="queue-item" key={title}><div><strong>{title}</strong><span>{index === 0 ? 'Диагностика гарнитур, контроллеров и трекинга' : index === 1 ? 'Проверить периферию, кабели и аксессуары' : 'Подготовить площадку и проверить бронирования'}</span></div><button className="ghost-btn" onClick={() => setModal('shiftTask')}>Назначить</button></div>
        ))}
      </section>
    </div>
  );
}

function Staff({ setModal }) {
  return (
    <div className="container wide staff-grid">
      <section className="panel employees-card">
        <div className="panel-title-row"><div><h2>Сотрудники</h2><p>Команда по локациям, ролям и контактам</p></div><button className="ghost-btn" onClick={() => setModal('addEmployee')}>Добавить</button></div>
        <div className="employee-list">
          {people.map((p) => <Employee key={p.name} person={p} onEdit={() => setModal('editEmployee')} />)}
        </div>
      </section>
      <section className="panel summary-card"><h2>Сводка</h2><p>Короткие метрики по команде</p><div className="summary-grid">{[['Администраторы','5','Активны сегодня'],['Техники','4','На площадках'],['Кассиры','3','В смене'],['Роли','5','В системе']].map(([a,b,c]) => <MiniStat key={a} value={b} label={a} sub={c} type="cyan" />)}</div></section>
      <section className="panel staff-activity"><h2>Последняя активность</h2><p>Изменения ролей и доступов</p><Timeline items={[[ '16:20', <><strong>Ольга П. получила права администратора</strong><span>Обновлены доступы к управлению залами и бронированиями.</span></> ],[ '15:48', <><strong>Добавлена роль «Старший техник»</strong><span>Назначены права на инциденты, диагностику и обновления оборудования.</span></> ]]}/></section>
      <section className="panel roles-card">
        <div className="panel-title-row"><div><h2>Роли и доступы</h2><p>Описание ролей и их разрешений</p></div><button className="ghost-btn" onClick={() => setModal('addRole')}>Добавить роль</button></div>
        <div className="role-list">
          {roles.map((r) => <div className="role-item" key={r.title}><span className="avatar">{r.icon}</span><div><strong>{r.title}</strong><small>{r.desc}</small></div><Badge type="blue">{r.access}</Badge><button className="ghost-btn" onClick={() => setModal('editRole')}>Изменить</button></div>)}
        </div>
      </section>
    </div>
  );
}

function Employee({ person, onEdit }) {
  return (
    <div className="employee-item"><span className="avatar">{person.initials}</span><div><strong>{person.name}</strong><small>{person.email}</small></div><Badge type="blue">{person.role}</Badge><button className="ghost-btn" onClick={onEdit}>Изменить</button></div>
  );
}

function Finance({ setModal }) {
  return (
    <div className="container wide finance-grid">
      <div className="stats-row small-stats">
        <StatCard label="Выручка за месяц" value="8.4 млн ₽" sub="+12%" icon="₽" />
        <StatCard label="Средний чек" value="1 240 ₽" sub="+4.8%" icon="⦿" />
        <StatCard label="Подписки активны" value="1 420" sub="+32" icon="◌" />
        <StatCard label="Долг клиентов" value="92 тыс ₽" sub="-8%" icon="◍" />
      </div>
      <section className="panel chart-card">
        <div className="panel-title-row"><div><h2>Динамика выручки</h2><p>График по неделям с плавной линией и ключевыми метриками</p></div><span className="pill">12 недель</span></div>
        <RevenueChart />
        <div className="chart-metrics"><MiniStat value="684 тыс ₽" label="Среднее" sub="" type="cyan"/><MiniStat value="912 тыс ₽" label="Пик" sub="" type="cyan"/><MiniStat value="+18%" label="Рост" sub="" type="green"/><MiniStat value="7.4%" label="Конверсия" sub="" type="cyan"/></div>
      </section>
      <section className="panel operations-card"><div className="panel-title-row"><div><h2>Последние операции</h2><p>Поток поступлений из сайта и кассы в реальном времени</p></div><span className="pill">Live</span></div><DataTable columns={['Дата','Описание','Сумма','Источник']} rows={[[ '16.11 · 18:42','Абонемент «VIP Месяц»','2 990 ₽',<Badge type="blue">Сайт</Badge> ],[ '16.11 · 17:21','Сеанс Arena · 2 ч','800 ₽',<Badge type="gray">Касса</Badge> ],[ '15.11 · 22:09','Комната Studio · 3 ч','2 400 ₽',<Badge type="blue">Сайт</Badge> ],[ '15.11 · 18:55','Продление тарифа Pro Stream','429 ₽',<Badge type="blue">Сайт</Badge> ]]}/></section>
      <section className="panel tariffs-card">
        <div className="panel-title-row"><div><h2>Тарифы и подписки</h2><p>Более чистая сетка, компактные действия и акцент на содержании, а не на линиях таблицы.</p></div><button className="tiny-btn" onClick={() => setModal('addTariff')}>3 активных тарифа</button></div>
        <DataTable columns={['Название','Цена','Активных','Действия']} rows={financeRows.map((r) => [<><strong>{r[0]}</strong><span className="muted-line">{r[1]}</span></>, r[2], <span className="round-badge">{r[3]}</span>, <div className="actions-cell"><button className="row-btn" onClick={() => setModal('editTariff')}>Изменить</button><button className="danger-btn">Удалить</button></div>])}/>
      </section>
    </div>
  );
}

function RevenueChart() {
  const points = useMemo(() => 'M10,160 C35,130 48,118 70,135 S110,140 125,98 S165,100 178,115 S210,78 235,82 S274,88 292,55 S335,45 350,58 S388,38 405,22', []);
  return <svg className="revenue-chart" viewBox="0 0 420 190"><defs><linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#31e3ef" stopOpacity="0.45"/><stop offset="1" stopColor="#31e3ef" stopOpacity="0.02"/></linearGradient><filter id="glow"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><path d={`${points} L405,180 L10,180 Z`} fill="url(#chartFill)"/><path d={points} fill="none" stroke="#31e3ef" strokeWidth="5" filter="url(#glow)" strokeLinecap="round"/><g>{[10,48,90,125,178,235,292,350,405].map((x, i) => <circle key={x} cx={x} cy={[160,130,135,98,115,82,55,58,22][i]} r="5" fill="#ebfbff" filter="url(#glow)"/> )}</g><g className="chart-labels">{['W2','W3','W4','W5','W6','W7','W8','W9','W10','W11','W12'].map((l, i) => <text key={l} x={25+i*36} y="178">{l}</text>)}</g></svg>;
}

function RegisterPage({ setPage }) {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <section className="auth-left"><h1>Подключите клуб к единой панели</h1><p>Управляйте бронированиями, станциями и персоналом в одном месте. Настройка занимает всего несколько минут.</p><div className="check-line">✓ Защищённый доступ и контроль ролей</div><div className="check-line">✓ Масштабирование сети клубов</div></section>
        <section className="auth-form"><h2>Регистрация</h2><div className="form-grid"><input placeholder="Имя"/><input placeholder="Фамилия"/><input className="full" placeholder="Email"/><input placeholder="Телефон"/><input placeholder="Роль"/><input className="full" placeholder="Название клуба"/><input placeholder="Пароль" type="password"/><input placeholder="Повторите пароль" type="password"/></div><label className="terms"><input type="checkbox"/> Я принимаю условия</label><button className="primary-btn full-btn" onClick={() => setPage('dashboard')}>Создать аккаунт</button><button className="link-btn" onClick={() => setPage('login')}>Уже есть доступ? Войти</button></section>
      </div>
    </div>
  );
}

function LoginPage({ setPage }) {
  return (
    <div className="auth-page">
      <div className="auth-card login-card">
        <section className="auth-left login-left">
          <h1>Вход в панель управления</h1>
          <p>
            Управляйте клубом: бронирования, станции, персонал и финансы в одном месте.
          </p>
          <p>Безопасный вход с защитой и контролем доступа.</p>
        </section>

        <section className="auth-form login-form">
          <input placeholder="Email" />
          <input placeholder="Пароль" type="password" />

          <div className="login-options">
            <label>
              <input type="checkbox" /> Запомнить
            </label>
            <button type="button">Забыли пароль?</button>
          </div>

          <button className="primary-btn full-btn" onClick={() => setPage('dashboard')}>
            Войти
          </button>

          <div className="social-row">
            <button>VK ID</button>
            <button>Google</button>
          </div>

          <button className="link-btn" onClick={() => setPage('register')}>
            Нет аккаунта? Создать
          </button>
        </section>
      </div>
    </div>
  );
}
function RemotePage({ setPage }) {
  return (
    <div className="remote-page">
      <button className="modal-close remote-close" onClick={() => setPage('dashboard')}>×</button>
      <main className="container wide remote-layout">
        <div className="remote-title"><h1>Удаленное управление · RTX-05</h1><p>Клиент: 49 <Badge type="green">Подключено</Badge> Задержка: 24 мс</p></div>
        <section className="remote-screen"><strong>22:46</strong><span>Рабочий стол<br/>Система</span></section>
        <aside className="panel remote-side"><h3>Управление</h3>{['Ctrl + Alt + Del','Заблокировать','Alt + Tab'].map(v => <button className="remote-btn" key={v}>{v}</button>)}<h3>Питание</h3>{['Перезагрузить','Выключить','Разбудить'].map(v => <button className="remote-btn" key={v}>{v}</button>)}<h3>Сообщение</h3><textarea placeholder="Введите сообщение..."/><button className="primary-btn full-btn">Отправить</button></aside>
      </main>
    </div>
  );
}

function Modal({ type, close }) {
  const content = {
    addStation: <FormModal title="Добавить станцию" subtitle="Создание новой карточки сотрудника" close={close} button="Сохранить" fields={['Название станции','Зал','Статус','Локация / описание']} area="Комментарий" />,
    addClub: <FormModal title="Добавить клуб" subtitle="Создание новой площадки в сети клубов" close={close} button="Создать клуб" fields={['Название клуба','Город','Адрес','Количество залов']} area="Комментарий или описание площадки" wide />,
    staffTask: <TaskModal title="Задача персонала" subtitle="Детали задачи и быстрые действия" task="Проверить VR-зал" desc="Контролировать трекинг на станциях VR-02/03" button="Назначить" close={close} />,
    activeStations: <TableModal title="Активные станции" subtitle="Полный список активных и обслуживаемых станций" close={close} />,
    addEmployee: <FormModal title="Добавить сотрудника" subtitle="Создание новой карточки сотрудника" close={close} button="Сохранить" fields={['Имя сотрудника','Email','Роль','Локация']} area="Комментарий или заметка" />,
    editEmployee: <FormModal title="Изменить сотрудника" subtitle="Редактирование данных профиля" close={close} button="Сохранить" fields={['Ольга П.','olga@club.ru','Администратор','Москва · Центр']} />,
    addRole: <FormModal title="Создать роль" subtitle="Новая роль и набор разрешений" close={close} button="Создать" fields={['Название роли','Краткое описание']} area="Разрешения и доступы" single />,
    editRole: <FormModal title="Изменить роль" subtitle="Обновление описания и доступов" close={close} button="Создать" fields={['Администратор','Управление залами и бронирование']} area="CRUD брони, инциденты" single />,
    assignShift: <FormModal title="Назначить смену" subtitle="Создание новой смены для сотрудника" close={close} button="Создать смену" fields={['Имя сотрудника','Роль','Локация','Время смены, например 10:00–18:00']} area="Комментарий к смене" wide />,
    shiftTask: <TaskModal title="Проверка VR-оборудования" subtitle="Подробности и назначение ответственного" task="Проверка VR-оборудования" desc="Диагностика гарнитур, контроллеров и трекинга до открытия вечерней смены." button="Назначить" close={close} />,
    editShift: <FormModal title="Изменить смену" subtitle="Редактирование выбранной записи" close={close} button="Сохранить" fields={['Ольга П.','Администратор','Москва · Центр','10:00–18:00']} wide />,
    editTariff: <TariffModal title="Изменить тариф" subtitle="Обнови название, цену и описание действующего предложения." close={close} button="Сохранить изменения" edit />,
    addTariff: <TariffModal title="Добавить тариф" subtitle="Заполни поля для создания нового предложения." close={close} button="Добавить" />,
    createBooking: (
  <FormModal
    title="Создать бронь"
    subtitle=""
    close={close}
    button="Создать смену"
    fields={['Имя клиента', 'Роль', 'Зал', 'Время смены, например 10:00–18:00']}
    area="Комментарий к смене"
    wide
  />
),
  }[type];
  return <div className="modal-backdrop"><div className={`modal ${type === 'activeStations' ? 'modal-table' : ''}`}>{content}</div></div>;
}

function FormModal({ title, subtitle, close, button, fields, area, wide, single }) {
  return <><div className="modal-head"><div><h2>{title}</h2><p>{subtitle}</p></div><button className="modal-close" onClick={close}>×</button></div><div className={`modal-body ${single ? 'single' : ''}`}>{fields.map((f) => <input key={f} placeholder={f} defaultValue={f.includes('Ольга') || f.includes('@') || f.includes('Администратор') || f.includes('Москва') || f.includes('10:00') || f === 'CRUD брони, инциденты' || f.includes('Управление') ? f : ''}/>)}{area && <textarea className={wide ? 'wide-area' : ''} placeholder={area} defaultValue={area.includes('CRUD') ? area : ''}/>}</div><div className="modal-actions"><button className="ghost-btn" onClick={close}>Отмена</button><button className="primary-btn" onClick={close}>{button}</button></div></>;
}

function TaskModal({ title, subtitle, task, desc, button, close }) {
  return <><div className="modal-head"><div><h2>{title}</h2><p>{subtitle}</p></div><button className="modal-close" onClick={close}>×</button></div><div className="task-modal-item"><strong>{task}</strong><span>{desc}</span></div><div className="modal-actions"><button className="ghost-btn" onClick={close}>Закрыть</button><button className="primary-btn" onClick={close}>{button}</button></div></>;
}

function TableModal({ title, subtitle, close }) {
  return <><div className="modal-head"><div><h2>{title}</h2><p>{subtitle}</p></div><button className="modal-close" onClick={close}>×</button></div><div className="modal-table-box"><DataTable columns={['Станция','Клиент','Зал','Статус']} rows={[[ 'RTX-18','Владимир C.','Центр · Arena',<Badge type="green">Играет · 37 мин</Badge> ],[ 'Studio-3','Команда Neon','СПБ · Studio',<Badge type="blue">Рендер · 82%</Badge> ],[ 'VR-02','Свободно','Екат · VR',<Badge type="yellow">Диагностика</Badge> ],[ 'RTX-09','Сеанс открыт','Центр · Arena',<Badge type="green">Играет · 12 мин</Badge> ]]}/></div></>;
}

function TariffModal({ title, subtitle, close, button, edit }) {
  return <><div className="modal-head"><div><h2>{title}</h2><p>{subtitle}</p></div><button className="modal-close" onClick={close}>×</button></div><div className="tariff-form"><label>Название тарифа</label><input placeholder="Например: Premium Night" defaultValue={edit ? 'Casual · почасовой' : ''}/><div className="two"><label>Цена<input placeholder="Например: 3 490 ₽" defaultValue={edit ? '249 ₽/ч' : ''}/></label><label>Активных пользователей<input placeholder="Например: 120" defaultValue={edit ? 'Оставь пустым для —' : ''}/></label></div><label>Описание</label><textarea placeholder="Краткое описание тарифа или подписки" defaultValue={edit ? 'Базовый почасовой тариф для разовых посещений.' : ''}/></div><div className="modal-actions"><button className="ghost-btn" onClick={close}>Отмена</button><button className="primary-btn" onClick={close}>{button}</button></div></>;
}

function DataTable({ columns, rows }) {
  return <table className="data-table"><thead><tr>{columns.map(c => <th key={c}>{c}</th>)}</tr></thead><tbody>{rows.map((r, i) => <tr key={i}>{r.map((cell, index) => <td key={index}>{cell}</td>)}</tr>)}</tbody></table>;
}

function Timeline({ items }) {
  return <div className="timeline">{items.map(([time, content], i) => <div className="timeline-row" key={i}><time>{time}</time><div className="timeline-card">{content}</div></div>)}</div>;
}

function Badge({ type = 'blue', children }) { return <span className={`badge ${type}`}>● {children}</span>; }
function FakeSelect({ label }) { return <button className="fake-select">{label}</button>; }

export default App;
