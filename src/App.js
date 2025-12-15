import React, { useState, useEffect } from "react";
// Добавлены иконки для выхода и настроек
import { FaTimes, FaPlus, FaArrowLeft, FaArrowRight, FaTrash, FaSave, FaSignOutAlt} from "react-icons/fa"; 
import "./App.css";

// --- API Configuration ---
const BASE_API_URL = 'http://localhost:8080';
const PETS_API_URL = `${BASE_API_URL}/api/pets`;
const EVENTS_API_URL = `${BASE_API_URL}/api/events`;
const SETTINGS_API_URL = `${BASE_API_URL}/api/settings`;
const AUTH_API_URL = `${BASE_API_URL}/api/auth`;

// -------------------------------------------------------------------
// НОВОЕ: Вспомогательная функция для защищенных запросов (с токеном)
// -------------------------------------------------------------------
const securedFetch = async (url, options = {}) => {
    const token = localStorage.getItem("accessToken");
    
    if (!token) {
        throw new Error("Нет токена авторизации. Пожалуйста, войдите.");
    }
    
    // Добавляем заголовок Authorization: Bearer <token>
    const headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
    };
    
    const response = await fetch(url, { ...options, headers });

    // Обработка 401/403: если токен недействителен, разлогиниваем пользователя
    if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("accessToken");
        alert("Сессия истекла или токен недействителен. Пожалуйста, войдите снова.");
        window.location.reload(); 
        return;
    }

    return response;
};

// Главный компонент приложения
const App = () => {
    // --- НОВОЕ: Состояние аутентификации и вкладок ---
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true); 
    const [activeTab, setActiveTab] = useState('pets'); // 'pets', 'gallery', 'settings', 'users'

    // --- Состояние для питомцев ---
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState({
        name: "", gender: "Мальчик", age: "", description: "",
        health: "", sterilized: false, tray: false, 
        photoFile: null, 
        photoPreviewUrl: null 
    });
    const [showItemDetails, setShowItemDetails] = useState(null);
    const [showNewForm, setShowNewForm] = useState(false);
    const [showAll, setShowAll] = useState(false);

    // --- Состояние для мероприятий (Галерея) ---
    const [carouselIndex, setCarouselIndex] = useState(0);
    const [images, setImages] = useState([]); 
    const [showEventDetails, setShowEventDetails] = useState(null); 
    const [newEvent, setNewEvent] = useState({ 
        title: "", 
        description: "", 
        imageFile: null 
    });
    const [showNewEventForm, setShowNewEventForm] = useState(false);
    
    // --- Состояние для контактов ---
    const [settings, setSettings] = useState({ 
        cardNumber: "", 
        accountNumber: "" 
    });
    
    // -------------------------------------------------------------------
    // НОВОЕ: ФУНКЦИИ АУТЕНТИФИКАЦИИ
    // -------------------------------------------------------------------
    
    // Проверка токена при загрузке
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            setIsAuthenticated(true);
        }
        setIsLoading(false);
        // Загружаем публичные данные независимо от авторизации
        loadPets();
        loadEvents();
        // Настройки грузим только после входа, чтобы не вызывать 401 сразу
        if (token) {
            loadSettings();
        }
    }, []);

    const handleLogin = (token) => {
        localStorage.setItem("accessToken", token);
        setIsAuthenticated(true);
        loadSettings(); // Загружаем настройки после входа
    };

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        setIsAuthenticated(false);
        setActiveTab('pets');
    };
    
    // ====================================================================
    // === CRUD Функции для ПИТОМЦЕВ (АДАПТИРОВАНЫ) ========================
    // ====================================================================

    // 1. (Read) Загрузка питомцев (ОСТАВЛЯЕМ БЕЗ ЗАЩИТЫ)
    const loadPets = () => {
        fetch(PETS_API_URL)
            .then(response => response.json())
            .then(data => {
                const petsWithFullPhotoPath = data.map(pet => ({
                    ...pet,
                    photo: pet.photo ? `${BASE_API_URL}${pet.photo}` : 'https://placedog.net/300/200' 
                }));
                setItems(petsWithFullPhotoPath.reverse());
            })
            .catch(error => console.error("Ошибка при загрузке питомцев:", error));
    };
    
    // 2. (Create) Добавление нового питомца (ИСПОЛЬЗУЕМ securedFetch)
    const addItem = async () => {
        const formData = new FormData();
        formData.append('name', newItem.name);
        formData.append('age', newItem.age);
        formData.append('gender', newItem.gender);
        formData.append('health', newItem.health);
        formData.append('description', newItem.description);
        formData.append('sterilized', newItem.sterilized);
        formData.append('tray', newItem.tray);
        
        if (newItem.photoFile) { 
            formData.append('photo', newItem.photoFile);
        }

        try {
            const response = await securedFetch(PETS_API_URL, {
                method: 'POST',
                body: formData,
            });
            if (response && response.ok) {
                setShowNewForm(false);
                setNewItem({
                    name: "", gender: "Мальчик", age: "", description: "",
                    health: "", sterilized: false, tray: false, photoFile: null, photoPreviewUrl: null
                });
                loadPets();
            }
        } catch (error) {
            console.error("Ошибка при добавлении питомца:", error);
        }
    };

    // 3. (Update) Обновление питомца (ИСПОЛЬЗУЕМ securedFetch)
    const handleUpdateItem = async (id, updatedData, photoFile) => {
        const formData = new FormData();
        formData.append('name', updatedData.name);
        formData.append('age', updatedData.age);
        formData.append('gender', updatedData.gender);
        formData.append('health', updatedData.health);
        formData.append('description', updatedData.description);
        formData.append('sterilized', updatedData.sterilized);
        formData.append('tray', updatedData.tray);

        if (photoFile) {
            formData.append('photo', photoFile);
        }
        
        try {
            const response = await securedFetch(`${PETS_API_URL}/${id}`, {
                method: 'PUT',
                body: formData,
            });
            if (response && response.ok) {
                setShowItemDetails(null); 
                loadPets(); 
            }
        } catch (error) {
            console.error("Ошибка при обновлении питомца:", error);
        }
    };

    // 4. (Delete) Удаление питомца (ИСПОЛЬЗУЕМ securedFetch)
    const removeItem = async (id) => {
        try {
            const response = await securedFetch(`${PETS_API_URL}/${id}`, {
                method: 'DELETE',
            });
            if (response && response.ok) {
                setShowItemDetails(null);
                loadPets();
            }
        } catch (error) {
            console.error("Ошибка при удалении питомца:", error);
        }
    };

    // --- Вспомогательные функции для питомцев ---
    const handleItemInput = (e) => {
        const { name, value, type, checked } = e.target;
        setNewItem({ ...newItem, [name]: type === "checkbox" ? checked : value });
    };
    
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewItem(prev => ({ 
                ...prev, 
                photoFile: file, 
                photoPreviewUrl: URL.createObjectURL(file) 
            }));
        }
    };
    
    // ====================================================================
    // === CRUD Функции для МЕРОПРИЯТИЙ (АДАПТИРОВАНЫ) =====================
    // ====================================================================
    
    // 1. (Read) Загрузка мероприятий (ОСТАВЛЯЕМ БЕЗ ЗАЩИТЫ)
    const loadEvents = () => {
        fetch(EVENTS_API_URL)
            .then(res => res.json())
            .then(data => {
                const eventsData = data.map(event => ({
                    id: event.id,
                    url: `${BASE_API_URL}${event.image}`, 
                    title: event.title,
                    description: event.description,
                }));
                setImages(eventsData); 
                if (eventsData.length > 0) setCarouselIndex(0);
            })
            .catch(error => console.error("Ошибка при загрузке мероприятий:", error));
    };
    
    // 2. (Create) Добавление нового мероприятия (ИСПОЛЬЗУЕМ securedFetch)
    const addEvent = async () => {
        if (!newEvent.title || !newEvent.imageFile) {
            alert("Заголовок, фото и описание мероприятия обязательны!");
            return;
        }

        const formData = new FormData();
        formData.append('title', newEvent.title);
        formData.append('description', newEvent.description);
        formData.append('image', newEvent.imageFile); 

        try {
            const response = await securedFetch(EVENTS_API_URL, {
                method: 'POST',
                body: formData,
            });
            if (response && response.ok) {
                setNewEvent({ title: "", description: "", imageFile: null });
                setShowNewEventForm(false);
                loadEvents(); 
            }
        } catch (error) {
            console.error("Ошибка при добавлении мероприятия:", error);
        }
    };
    
    // 3. (Update) Обновление мероприятия (ИСПОЛЬЗУЕМ securedFetch)
    const updateEvent = async (id, updatedData, imageFile) => {
        const formData = new FormData();
        formData.append('title', updatedData.title);
        formData.append('description', updatedData.description);
        
        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            const response = await securedFetch(`${EVENTS_API_URL}/${id}`, {
                method: 'PUT',
                body: formData,
            });
            if (response && response.ok) {
                setShowEventDetails(null); 
                loadEvents(); 
            }
        } catch (error) {
            console.error("Ошибка при обновлении мероприятия:", error);
        }
    };
    
    // 4. (Delete) Удаление мероприятия (ИСПОЛЬЗУЕМ securedFetch)
    const removeEvent = async (id) => {
        if (!window.confirm("Вы уверены, что хотите удалить это мероприятие?")) return;

        try {
            const response = await securedFetch(`${EVENTS_API_URL}/${id}`, {
                method: 'DELETE',
            });
            if (response && response.ok) {
                loadEvents(); 
            }
        } catch (error) {
            console.error("Ошибка при удалении мероприятия:", error);
        }
    };

    // --- Handlers для Галереи ---
    const handleNewEventInput = (e) => {
        const { name, value } = e.target;
        setNewEvent({ ...newEvent, [name]: value });
    };

    const handleNewEventImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewEvent(prev => ({ ...prev, imageFile: file }));
        }
    };
    
    const removeImageFromCarousel = (indexToRemove) => {
        if (images[indexToRemove]) {
            removeEvent(images[indexToRemove].id);
        }
    };

    // ====================================================================
    // === CRUD Функции для Settings (АДАПТИРОВАНЫ) ========================
    // ====================================================================

    // 1. (Read) Загрузка настроек (ИСПОЛЬЗУЕМ securedFetch)
    const loadSettings = async () => {
        try {
            const response = await securedFetch(SETTINGS_API_URL);
            const data = await response.json();
            
            setSettings({
                cardNumber: data.card_number || "",
                accountNumber: data.account_number || ""
            });
        } catch (error) {
            console.error("Ошибка при загрузке настроек:", error);
        }
    };

    // 2. (Update) Сохранение настроек (ИСПОЛЬЗУЕМ securedFetch)
    const saveSettings = async () => {
        const dataToSend = {
            cardNumber: settings.cardNumber,
            accountNumber: settings.accountNumber
        };

        try {
            const response = await securedFetch(SETTINGS_API_URL, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend),
            });
            if (response && response.ok) {
                const data = await response.json();
                alert(data.message || "Настройки успешно сохранены.");
                loadSettings();
            }
        } catch (error) {
            console.error("Ошибка при сохранении настроек:", error);
        }
    };

    const visibleItems = showAll ? items : items.slice(0, 7);
    const next = () => setCarouselIndex((carouselIndex + 1) % images.length);
    const prev = () => setCarouselIndex((carouselIndex - 1 + images.length) % images.length);

    // -------------------------------------------------------------------
    // РЕНДЕР: Главный компонент App
    // -------------------------------------------------------------------
    
    if (isLoading) {
        return <div className="loading">Загрузка...</div>;
    }
    
    // УСЛОВНЫЙ РЕНДЕР: Если не залогинен, показываем форму входа
    if (!isAuthenticated) {
        return <LoginForm onLogin={handleLogin} />;
    }

    // Рендер после успешного входа
    return (
        <div className="container">
            <h1 className="main-title">
                Административная панель 
                <button onClick={handleLogout} className="action-button danger-button logout-button">
                    <FaSignOutAlt style={{ marginRight: '5px' }} /> Выход
                </button>
            </h1>
            
            {/* НОВОЕ: Меню навигации */}
            <div className="admin-tabs">
                <button 
                    className={activeTab === 'pets' ? 'tab-active' : ''} 
                    onClick={() => setActiveTab('pets')}
                >
                    Питомцы
                </button>
                <button 
                    className={activeTab === 'gallery' ? 'tab-active' : ''} 
                    onClick={() => setActiveTab('gallery')}
                >
                    Галерея
                </button>
                <button 
                    className={activeTab === 'settings' ? 'tab-active' : ''} 
                    onClick={() => setActiveTab('settings')}
                >
                    Реквизиты
                </button>
                <button 
                    className={activeTab === 'users' ? 'tab-active' : ''} 
                    onClick={() => setActiveTab('users')}
                >
                    Пользователи
                </button>
            </div>
            
            {/* Рендер контента в зависимости от вкладки */}
            
            {/* Вкладка: Питомцы */}
            {activeTab === 'pets' && (
                <section>
                    <h2 className="section-title">Наши питомцы</h2>
                    <div className="pets-grid">
                        <AddPetCard onClick={() => setShowNewForm(true)} />
                        {visibleItems.map((item) => (
                            <PetCard
                                key={item.id}
                                item={item}
                                onCardClick={() => setShowItemDetails(item)}
                                onRemoveClick={(e) => {
                                    e.stopPropagation();
                                    if (window.confirm(`Вы уверены, что хотите удалить ${item.name}?`)) {
                                        removeItem(item.id);
                                    }
                                }}
                            />
                        ))}
                    </div>
                    {items.length > 7 && (
                        <button onClick={() => setShowAll(!showAll)} className="show-more-btn">
                            {showAll ? "Свернуть" : "Показать ещё"}
                        </button>
                    )}
                </section>
            )}

            {/* Вкладка: Галерея */}
            {activeTab === 'gallery' && (
                <Gallery
                    images={images}
                    currentIndex={carouselIndex}
                    onNext={next}
                    onPrev={prev}
                    onRemove={removeImageFromCarousel} 
                    onEdit={(event) => setShowEventDetails(event)}
                    onAddClick={() => setShowNewEventForm(true)}
                />
            )}
            
            {/* Вкладка: Реквизиты */}
            {activeTab === 'settings' && (
                <Contacts 
                    settings={settings} 
                    setSettings={setSettings} 
                    onSave={saveSettings} 
                />
            )}

            {/* Вкладка: Пользователи */}
            {activeTab === 'users' && (
                <AdminUsers />
            )}
            
            {/* МОДАЛЬНЫЕ ОКНА */}
            {showItemDetails && activeTab === 'pets' && (
                <PetDetailsModal
                    item={showItemDetails}
                    onClose={() => setShowItemDetails(null)}
                    onSave={handleUpdateItem} 
                    onDelete={() => {
                        if (window.confirm(`Вы уверены, что хотите удалить ${showItemDetails.name}?`)) {
                            removeItem(showItemDetails.id);
                        }
                    }}
                />
            )}

            {showNewForm && activeTab === 'pets' && (
                <AddPetFormModal
                    newItem={newItem}
                    onInputChange={handleItemInput}
                    onImageUpload={handleImageUpload}
                    onRemovePhoto={() => setNewItem(prev => ({ ...prev, photoFile: null, photoPreviewUrl: null }))}
                    onAdd={addItem}
                    onClose={() => setShowNewForm(false)}
                />
            )}

            {showNewEventForm && activeTab === 'gallery' && (
                <AddEventFormModal
                    newEvent={newEvent}
                    onInputChange={handleNewEventInput}
                    onImageUpload={handleNewEventImageUpload}
                    onRemovePhoto={() => setNewEvent(prev => ({ ...prev, imageFile: null }))}
                    onAdd={addEvent}
                    onClose={() => setShowNewEventForm(false)}
                />
            )}
            
            {showEventDetails && activeTab === 'gallery' && (
                <EventDetailsModal
                    event={showEventDetails}
                    onClose={() => setShowEventDetails(null)}
                    onSave={updateEvent} 
                    onDelete={(id) => {
                        if (window.confirm(`Вы уверены, что хотите удалить мероприятие?`)) {
                            removeEvent(id);
                            setShowEventDetails(null);
                        }
                    }}
                />
            )}
        </div>
    );
};

// -------------------------------------------------------------------
// НОВЫЙ КОМПОНЕНТ: LoginForm
// -------------------------------------------------------------------
const LoginForm = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignin = async () => {
        setError('');
        try {
            const response = await fetch(`${AUTH_API_URL}/signin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Ошибка входа. Проверьте логин/пароль.');
                return;
            }
            onLogin(data.accessToken);

        } catch (err) {
            setError('Не удалось подключиться к серверу.');
        }
    };
    

    return (
        <div className="login-container">
            <h2 className="section-title">Вход в панель администратора</h2>
            <div className="login-form">
                <input
                    type="text"
                    placeholder="Имя пользователя"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="form-input"
                />
                <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                />
                {error && <p className="error-message">{error}</p>}
                
                <div className="login-actions">
                    <button onClick={handleSignin} className="action-button success-button">
                        Войти
                    </button>
                </div>
            </div>
        </div>
    );
};

// -------------------------------------------------------------------
// НОВЫЙ КОМПОНЕНТ: AdminUsers (Управление пользователями)
// -------------------------------------------------------------------
const AdminUsers = () => {
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [changePassword, setChangePassword] = useState('');
    const [message, setMessage] = useState('');
    
    // Внимание: на бэкенде пока реализован только /api/auth/signup (доступный без токена для первого админа)
    // В AdminUsers мы должны использовать ЗАЩИЩЕННЫЙ маршрут для создания нового админа.
    // На бэкенде нужно будет создать отдельный контроллер и маршрут, например: /api/users/create
    const handleCreateUser = async () => {
        setMessage('');
        if (!newUsername || !newPassword) {
            setMessage("Заполните оба поля для нового пользователя.");
            return;
        }

        try {
            // !!! ВНИМАНИЕ: Здесь нужно будет использовать защищенный маршрут, 
            // например, POST /api/users/create, когда он будет реализован на бэкенде.
            // Пока используем /api/auth/signup, но в боевом режиме это опасно.
            const response = await securedFetch(`${AUTH_API_URL}/signup`, { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: newUsername, password: newPassword }),
            });
            
            if (response && response.ok) {
                 // Здесь мы должны получить ответ, чтобы узнать имя
                const data = await response.json(); 
                setMessage(`Администратор ${data.username} успешно создан.`);
                setNewUsername('');
                setNewPassword('');
            } else if (response) {
                const data = await response.json();
                setMessage(data.message || 'Ошибка создания пользователя.');
            }
        } catch (err) {
            setMessage('Ошибка подключения или нет прав доступа.');
        }
    };
    
    // Внимание: эту функцию нужно будет реализовать на бэкенде (PUT /api/users/change-password)
    const handleChangePassword = async () => {
        setMessage('');
        if (!currentPassword || !changePassword) {
            setMessage("Заполните поля текущего и нового паролей.");
            return;
        }

        try {
            // !!! НУЖНО РЕАЛИЗОВАТЬ НА БЭКЕНДЕ
            // const response = await securedFetch(`${BASE_API_URL}/api/users/change-password`, { 
            //     method: 'PUT',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ currentPassword, newPassword: changePassword }),
            // });
            
            // if (response && response.ok) {
            //     setMessage('Пароль успешно изменен!');
            //     setCurrentPassword('');
            //     setChangePassword('');
            // } else if (response) {
            //     const data = await response.json();
            //     setMessage(data.message || 'Ошибка смены пароля.');
            // }
            setMessage('Функция смены пароля пока не реализована на бэкенде!');
        } catch (err) {
            setMessage('Ошибка подключения.');
        }
    };

    return (
        <section className="form-container user-management-container">
            <h2 className="section-title">Управление пользователями</h2>
            {message && <p className="status-message">{message}</p>}

            {/* Блок 1: Создание нового администратора */}
            <div className="user-action-block">
                <h3>Создать нового администратора</h3>
                <input
                    type="text"
                    placeholder="Имя пользователя"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="form-input"
                />
                <input
                    type="password"
                    placeholder="Пароль"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="form-input"
                />
                <button onClick={handleCreateUser} className="action-button success-button">
                    <FaPlus /> Создать
                </button>
            </div>
            
            <hr style={{ margin: '30px 0' }}/>
            
            {/* Блок 2: Смена пароля текущего пользователя */}
            <div className="user-action-block">
                <h3>Смена пароля</h3>
                <input
                    type="password"
                    placeholder="Текущий пароль"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="form-input"
                />
                <input
                    type="password"
                    placeholder="Новый пароль"
                    value={changePassword}
                    onChange={(e) => setChangePassword(e.target.value)}
                    className="form-input"
                />
                <button onClick={handleChangePassword} className="action-button default-button">
                    <FaSave /> Сменить пароль
                </button>
            </div>
        </section>
    );
};


// --- Дочерние компоненты (без изменений) ---

const PetCard = ({ item, onCardClick, onRemoveClick }) => (
    <div className="pet-card" onClick={onCardClick}>
        <button onClick={onRemoveClick} className="remove-btn pet-card-remove-btn">
            <FaTrash />
        </button>
        <img src={item.photo} alt={item.name} className="pet-card-img" />
        <p><strong>Имя:</strong> {item.name}</p>
        <p><strong>Пол:</strong> {item.gender}</p>
        <p><strong>Возраст:</strong> {item.age}</p>
    </div>
);

const AddPetCard = ({ onClick }) => (
    <div className="add-pet-card" onClick={onClick}>
        <FaPlus size={40} />
    </div>
);

const Gallery = ({ images, currentIndex, onNext, onPrev, onRemove, onEdit, onAddClick }) => (
    <section>
        <h2 className="section-title">Галерея мероприятий</h2>
        <div className="gallery">
            <button onClick={onPrev} className="gallery-arrow" disabled={images.length <= 1}><FaArrowLeft size={24} /></button>
            <div className="gallery-slide">
                {images.length > 0 ? (
                    <>
                        <div className="gallery-img-container" onClick={() => onEdit(images[currentIndex])}>
                            <img src={images[currentIndex].url} alt={images[currentIndex].title} className="gallery-img" />
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation(); 
                                    onRemove(currentIndex);
                                }} 
                                className="remove-btn gallery-remove-btn"
                            >
                                <FaTrash />
                            </button>
                        </div>
                        <div className="gallery-description">
                            <h3>{images[currentIndex].title}</h3>
                            <p>{images[currentIndex].description}</p>
                        </div>
                    </>
                ) : (
                    <div className="gallery-empty">Галерея пуста</div>
                )}
            </div>
            <button onClick={onNext} className="gallery-arrow" disabled={images.length <= 1}><FaArrowRight size={24} /></button>
        </div>
        <button onClick={onAddClick} className="action-button success-button" style={{ marginTop: '20px' }}>
            <FaPlus style={{ marginRight: '5px' }}/> Добавить мероприятие
        </button>
    </section>
);

const Contacts = ({ settings, setSettings, onSave }) => {
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSettings({ ...settings, [name]: value });
    };

    return (
        <section className="form-container">
            <h2 className="section-title">Реквизиты</h2>
            <p className="section-description">
                Здесь вы управляете данными карты и счета для пожертвований.
            </p>
            
            <div className="contact-field">
                <label>Номер карты:</label>
                <input 
                    name="cardNumber" 
                    value={settings.cardNumber} 
                    onChange={handleInputChange} 
                    className="form-input" 
                    placeholder="Например, 1234 5678 9012 3456"
                />
            </div>
            
            <div className="contact-field">
                <label>Номер счета:</label>
                <input 
                    name="accountNumber" 
                    value={settings.accountNumber} 
                    onChange={handleInputChange} 
                    className="form-input" 
                    placeholder="Например, 40817810000000000000"
                />
            </div>
            
            <button onClick={onSave} className="action-button success-button" style={{ marginTop: '10px' }}>
                <FaSave style={{ marginRight: '5px' }} /> Сохранить реквизиты
            </button>
        </section>
    );
};

const PetDetailsModal = ({ item, onClose, onSave, onDelete }) => {
    const [editData, setEditData] = useState({ ...item });
    const [newPhotoFile, setNewPhotoFile] = useState(null);

    useEffect(() => {
        setEditData({ ...item });
        setNewPhotoFile(null); 
    }, [item]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        setNewPhotoFile(e.target.files[0]);
    };

    const handleSaveClick = () => {
        onSave(item.id, editData, newPhotoFile);
    };

    let photoPreview = editData.photo; 
    if (newPhotoFile) {
        photoPreview = URL.createObjectURL(newPhotoFile);
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button onClick={onClose} className="remove-btn modal-close-btn"><FaTimes /></button>
                
                <div className="modal-img-upload-container">
                    <img src={photoPreview} alt={editData.name} className="modal-img" />
                </div>
                
                <div className="modal-details">
                    <label>Имя:</label>
                    <input name="name" value={editData.name} onChange={handleInputChange} className="form-input" />
                    
                    <label>Пол:</label>
                    <div className="radio-group">
                        <label><input type="radio" name="gender" value="Мальчик" checked={editData.gender === "Мальчик"} onChange={handleInputChange} /> Мальчик</label>
                        <label><input type="radio" name="gender" value="Девочка" checked={editData.gender === "Девочка"} onChange={handleInputChange} /> Девочка</label>
                    </div>

                    <label>Возраст:</label>
                    <input name="age" value={editData.age} onChange={handleInputChange} className="form-input" />
                    
                    <label>Состояние здоровья:</label>
                    <input name="description" value={editData.description} onChange={handleInputChange} className="form-input" />
                    
                    <label>Описание характера питомца:</label>
                    <textarea name="health" value={editData.health || ''} onChange={handleInputChange} className="form-textarea" />

                    <div className="checkbox-group">
                        <label><input type="checkbox" name="sterilized" checked={editData.sterilized} onChange={handleInputChange} /> Стерилизован</label>
                        <label><input type="checkbox" name="tray" checked={editData.tray} onChange={handleInputChange} /> Приучен к лотку</label>
                    </div>

                    <div className="modal-actions">

                        <div style={{marginBottom: '2em', marginTop: '2em'}}>
                            <label htmlFor="photo-upload-edit" className="action-button default-button file-upload-button">
                                {newPhotoFile ? `Фото: ${newPhotoFile.name}` : 'Изменить фото'}
                                <input 
                                    id="photo-upload-edit" 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleFileChange} 
                                    style={{ display: 'none'}} 
                                />
                            </label>
                        </div>

                        <button onClick={handleSaveClick} className="action-button success-button" style={{marginRight: '1em'}}>
                            Сохранить
                        </button>
                        
                        <button onClick={onDelete} className="action-button danger-button">
                            Удалить
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AddPetFormModal = ({ newItem, onInputChange, onImageUpload, onRemovePhoto, onAdd, onClose }) => (
    <div className="modal-overlay">
        <div className="modal-content">
            <button onClick={onClose} className="remove-btn modal-close-btn"><FaTimes /></button>
            
            <div className="modal-img-upload-container">
                {newItem.photoFile ? (
                    <>
                        <img src={newItem.photoPreviewUrl} alt="Предпросмотр" className="modal-img" />
                        <button onClick={onRemovePhoto} className="remove-btn image-preview-remove-btn"><FaTimes /></button>
                    </>
                ) : (
                    <>
                        <FaPlus size={80} color="#9ca3af" />
                        <input type="file" accept="image/*" onChange={onImageUpload} className="image-upload-input" />
                    </>
                )}
                {newItem.photoFile && <p style={{marginTop: '10px'}}>Выбран файл: {newItem.photoFile.name}</p>}
            </div>
            
            <div className="modal-details">
                <input name="name" placeholder="Имя" value={newItem.name} onChange={onInputChange} className="form-input" />
                <div className="radio-group">
                    <label><input type="radio" name="gender" value="Мальчик" checked={newItem.gender === "Мальчик"} onChange={onInputChange} /> Мальчик</label>
                    <label><input type="radio" name="gender" value="Девочка" checked={newItem.gender === "Девочка"} onChange={onInputChange} /> Девочка</label>
                </div>
                <input name="age" placeholder="Возраст (например, 2 года)" value={newItem.age} onChange={onInputChange} className="form-input" />
                <input name="description" placeholder="Состояние здоровья" value={newItem.description} onChange={onInputChange} className="form-input" />
                <textarea name="health" placeholder="Главная черта характера" value={newItem.health} onChange={onInputChange} className="form-textarea" />
                <div className="checkbox-group">
                    <label><input type="checkbox" name="sterilized" checked={newItem.sterilized} onChange={onInputChange} /> Стерилизован</label>
                    <label><input type="checkbox" name="tray" checked={newItem.tray} onChange={onInputChange} /> Приучен к лотку</label>
                </div>
                <button onClick={onAdd} className="action-button success-button">Добавить питомца</button>
            </div>
        </div>
    </div>
);

const AddEventFormModal = ({ newEvent, onInputChange, onImageUpload, onRemovePhoto, onAdd, onClose }) => (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose} className="remove-btn modal-close-btn"><FaTimes /></button>
        
        <div className="modal-img-upload-container">
          {newEvent.imageFile ? (
            <>
              <img src={URL.createObjectURL(newEvent.imageFile)} alt="Предпросмотр" className="modal-img" />
              <button onClick={onRemovePhoto} className="remove-btn image-preview-remove-btn"><FaTimes /></button>
            </>
          ) : (
            <>
              <FaPlus size={80} color="#9ca3af" />
              <input type="file" accept="image/*" onChange={onImageUpload} className="image-upload-input" />
            </>
          )}
          {newEvent.imageFile && <p style={{marginTop: '10px'}}>Выбран файл: {newEvent.imageFile.name}</p>}
        </div>
        
        <div className="modal-details">
          <input name="title" placeholder="Заголовок мероприятия" value={newEvent.title} onChange={onInputChange} className="form-input" />
          <textarea name="description" placeholder="Описание мероприятия" value={newEvent.description} onChange={onInputChange} className="form-textarea" rows="3" />
          <button onClick={onAdd} className="action-button success-button">Создать мероприятие</button>
        </div>
      </div>
    </div>
);

const EventDetailsModal = ({ event, onClose, onSave, onDelete }) => {
    const [editData, setEditData] = useState({ title: event.title, description: event.description });
    const [newPhotoFile, setNewPhotoFile] = useState(null);

    useEffect(() => {
        setEditData({ title: event.title, description: event.description });
        setNewPhotoFile(null); 
    }, [event]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setNewPhotoFile(e.target.files[0]);
    };

    const handleSaveClick = () => {
        onSave(event.id, editData, newPhotoFile);
    };

    const handleDeleteClick = () => {
        onDelete(event.id);
    };

    let photoPreview = event.url; 
    if (newPhotoFile) {
        photoPreview = URL.createObjectURL(newPhotoFile);
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button onClick={onClose} className="remove-btn modal-close-btn"><FaTimes /></button>
                
                <div className="modal-img-upload-container">
                    <img src={photoPreview} alt={editData.title} className="modal-img" />
                </div>
                
                <div className="modal-details">
                    <h3>Редактирование мероприятия</h3>

                    <label>Заголовок:</label>
                    <input name="title" value={editData.title} onChange={handleInputChange} className="form-input" />
                    
                    <label>Описание:</label>
                    <textarea name="description" value={editData.description} onChange={handleInputChange} className="form-textarea" rows="4" />
                    
                    <div className="modal-actions">

                        <div style={{marginBottom: '2em', marginTop: '2em'}}>
                            <label htmlFor="photo-upload-edit-event" className="action-button default-button file-upload-button">
                                {newPhotoFile ? `Фото: ${newPhotoFile.name}` : 'Изменить фото'}
                                <input 
                                    id="photo-upload-edit-event" 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleFileChange} 
                                    style={{ display: 'none'}} 
                                />
                            </label>
                        </div>

                        <button onClick={handleSaveClick} className="action-button success-button" style={{marginRight: '1em'}}>
                            Сохранить
                        </button>
                        
                        <button onClick={handleDeleteClick} className="action-button danger-button">
                            Удалить
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;