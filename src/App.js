import React, { useState, useEffect } from "react";
import { FaTimes, FaPlus, FaArrowLeft, FaArrowRight } from "react-icons/fa";

const App = () => {
  // Состояние для питомцев
  const [initialItems] = useState([
    { name: "Шарик", gender: "Мальчик", age: "2 года", photo: "https://placedog.net/300/200?id=1", description: "Ласковый и игривый пёс" },
    { name: "Мурка", gender: "Девочка", age: "1 год", photo: "https://placedog.net/300/200?id=2", description: "Осторожная и спокойная кошка" },
    { name: "Томми", gender: "Мальчик", age: "3 года", photo: "https://placedog.net/300/200?id=3", description: "Очень активный и любящий" },
    { name: "Ляля", gender: "Девочка", age: "4 года", photo: "https://placedog.net/300/200?id=4", description: "Заботливая и нежная" },
    { name: "Бобик", gender: "Мальчик", age: "5 лет", photo: "https://placedog.net/300/200?id=5", description: "Требует внимания и любви" },
    { name: "Рекс", gender: "Мальчик", age: "6 лет", photo: "https://placedog.net/300/200?id=6", description: "Ласковый и защитник" },
    { name: "Чарли", gender: "Мальчик", age: "1 год", photo: "https://placedog.net/300/200?id=7", description: "Любит играть с детьми" },
    { name: "Джессика", gender: "Девочка", age: "2 года", photo: "https://placedog.net/300/200?id=8", description: "Спокойная и нежная" }
  ]);

  const [items, setItems] = useState(initialItems);
  const [newItem, setNewItem] = useState({
    name: "",
    gender: "Мальчик",
    age: "",
    photo: "",
    description: "",
    sterilized: false,
    litterTrained: false,
    additional: ""
  });
  const [showItemDetails, setShowItemDetails] = useState(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 800);
  const [isSmallMobile, setIsSmallMobile] = useState(window.innerWidth < 400);

  // Состояние для карусели
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [images, setImages] = useState([
    {
      url: "https://placedog.net/500/400",
      title: "Собака",
      description: "Описание собаки",
    },
    {
      url: "https://placebear.com/400/300",
      title: "Медведь",
      description: "Описание медведя",
    },
  ]);
  const [newImage, setNewImage] = useState({ url: "", title: "", description: "" });
  
  // Состояние для контактов
  const [contacts, setContacts] = useState({ phone: "8-800-555-35-35", requisites: "ИНН 1234567890" });

  // Эффект для отслеживания изменения размера экрана
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 800);
      setIsSmallMobile(window.innerWidth < 400);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Функции для работы с питомцами
  const addItem = () => {
    if (newItem.name && newItem.gender && newItem.age && newItem.description) {
      const itemToAdd = { ...newItem, photo: newItem.photo || "https://placedog.net/300/200" };
      setItems([itemToAdd, ...items]);
      setNewItem({
        name: "",
        gender: "Мальчик",
        age: "",
        photo: "",
        description: "",
        sterilized: false,
        litterTrained: false,
        additional: ""
      });
      setShowNewForm(false);
    }
  };

  const handleItemInput = (e) => {
    const { name, value, type, checked } = e.target;
    setNewItem({ ...newItem, [name]: type === "checkbox" ? checked : value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewItem(prev => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeUploadedPhoto = () => {
    setNewItem(prev => ({ ...prev, photo: "" }));
  };

  const removeItemByIndex = (indexToRemove) => {
    setItems(items.filter((_, idx) => idx !== indexToRemove));
    setShowItemDetails(null);
  };

  const openItemDetails = (index) => {
    setShowItemDetails(index);
  };

  const closeItemDetails = () => {
    setShowItemDetails(null);
  };

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  const visibleItems = showAll ? items : items.slice(0, 4);

  // Функции для работы с каруселью
  const next = () => {
    setCarouselIndex((carouselIndex + 1) % images.length);
  };

  const prev = () => {
    setCarouselIndex((carouselIndex - 1 + images.length) % images.length);
  };

  const handleImageInput = (e) => {
    const { name, value } = e.target;
    setNewImage({ ...newImage, [name]: value });
  };

  const addCarouselItem = () => {
    if (newImage.url && newImage.title) {
      setImages([newImage, ...images]);
      setNewImage({ url: "", title: "", description: "" });
    }
  };

  const removeImageFromCarousel = (indexToRemove) => {
    setImages(images.filter((_, idx) => idx !== indexToRemove));
    if (carouselIndex >= indexToRemove && carouselIndex !== 0) {
      setCarouselIndex(carouselIndex - 1);
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px", fontFamily: "sans-serif" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Административная панель управления</h1>

      {/* Список питомцев */}
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Наши питомцы</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: "16px",
          marginBottom: "40px"
        }}
      >
        <div
          onClick={() => setShowNewForm(true)}
          style={{
            backgroundColor: "#f3f4f6",
            border: "2px dashed #9ca3af",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "220px",
            cursor: "pointer",
          }}
        >
          <FaPlus size={40} color="#9ca3af" />
        </div>

        {visibleItems.map((item, index) => (
          <div
            key={index}
            onClick={() => openItemDetails(index)}
            style={{
              position: "relative",
              backgroundColor: "#f3f4f6",
              padding: "12px",
              borderRadius: "12px",
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeItemByIndex(index);
              }}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
            >
              <FaTimes color="#ef4444" />
            </button>
            <img
              src={item.photo}
              alt={item.name}
              style={{
                width: "100%",
                height: "120px",
                objectFit: "cover",
                borderRadius: "8px",
                marginBottom: "10px",
              }}
            />
            <p><strong>Имя:</strong> {item.name}</p>
            <p><strong>Пол:</strong> {item.gender}</p>
            <p><strong>Возраст:</strong> {item.age}</p>
          </div>
        ))}
      </div>

      {items.length > 4 && (
        <button
          onClick={toggleShowAll}
          style={{ 
            marginTop: "20px", 
            padding: "10px 20px", 
            backgroundColor: "#3b82f6", 
            color: "white", 
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            display: "block",
            margin: "0 auto 40px"
          }}
        >
          {showAll ? "Свернуть" : "Показать ещё"}
        </button>
      )}

      {/* Карусель */}
      <div style={{ marginBottom: "40px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Галерея</h2>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
          <button onClick={prev} style={{ background: "transparent", border: "none", cursor: "pointer" }}>
            <FaArrowLeft size={24} />
          </button>

          <div style={{ 
            position: "relative", 
            display: "flex", 
            alignItems: "center", 
            flex: 1, 
            margin: "0 20px", 
            padding: "20px", 
            backgroundColor: "#f9fafb", 
            borderRadius: "12px", 
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            minHeight: "250px",
            flexDirection: isMobile ? "column" : "row"
          }}>
            <div style={{ 
              position: "relative",
              width: isMobile ? "100%" : "50%",
              height: isMobile ? "200px" : "100%",
              marginRight: isMobile ? 0 : "20px",
              marginBottom: isMobile ? "20px" : 0
            }}>
              <img
                src={images[carouselIndex].url}
                alt={images[carouselIndex].title}
                style={{ 
                  width: "100%",
                  height: "100%",
                  objectFit: "cover", 
                  borderRadius: "8px"
                }}
              />
              <button
                onClick={() => removeImageFromCarousel(carouselIndex)}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <FaTimes color="#ef4444" />
              </button>
            </div>
            <div style={{ 
              flex: 1,
              width: isMobile ? "100%" : "50%",
              padding: isMobile ? 0 : "0 20px"
            }}>
              <h3>{images[carouselIndex].title}</h3>
              <p style={{ color: "#6b7280" }}>{images[carouselIndex].description}</p>
            </div>
          </div>

          <button onClick={next} style={{ background: "transparent", border: "none", cursor: "pointer" }}>
            <FaArrowRight size={24} />
          </button>
        </div>

        {/* Форма для добавления нового изображения в карусель */}
        <div style={{ 
          backgroundColor: "#f3f4f6", 
          padding: "20px", 
          borderRadius: "12px",
          marginBottom: "20px"
        }}>
          <h3>Добавить изображение в карусель</h3>
          <input
            name="url"
            placeholder="URL картинки"
            value={newImage.url}
            onChange={handleImageInput}
            style={{ padding: "8px", width: "100%", marginBottom: "10px" }}
          />
          <input
            name="title"
            placeholder="Заголовок"
            value={newImage.title}
            onChange={handleImageInput}
            style={{ padding: "8px", width: "100%", marginBottom: "10px" }}
          />
          <input
            name="description"
            placeholder="Описание"
            value={newImage.description}
            onChange={handleImageInput}
            style={{ padding: "8px", width: "100%", marginBottom: "10px" }}
          />
          <button
            onClick={addCarouselItem}
            style={{ 
              backgroundColor: "#3b82f6", 
              color: "white", 
              padding: "10px 20px", 
              borderRadius: "8px",
              border: "none",
              cursor: "pointer"
            }}
          >
            Добавить в карусель
          </button>
        </div>
      </div>

      {/* Контакты */}
      <div style={{ 
        backgroundColor: "#f3f4f6", 
        padding: "20px", 
        borderRadius: "12px",
        marginBottom: "40px"
      }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Контакты</h2>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Телефон:</label>
          <input
            value={contacts.phone}
            onChange={(e) => setContacts({ ...contacts, phone: e.target.value })}
            style={{ padding: "8px", width: "100%" }}
          />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "5px" }}>Реквизиты:</label>
          <input
            value={contacts.requisites}
            onChange={(e) => setContacts({ ...contacts, requisites: e.target.value })}
            style={{ padding: "8px", width: "100%" }}
          />
        </div>
      </div>

      {/* Модальное окно деталей питомца */}
      {showItemDetails !== null && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
        }}>
          <div style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            backgroundColor: "#fff",
            width: "80%",
            height: "80%",
            borderRadius: "12px",
            position: "relative",
            overflow: "hidden"
          }}>
            <button
              onClick={closeItemDetails}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "transparent",
                border: "none",
                fontSize: "20px",
                cursor: "pointer",
                zIndex: 1
              }}
            >
              <FaTimes color="#ef4444" />
            </button>
            <div style={{ 
              width: isMobile ? "100%" : "50%", 
              height: isMobile ? "40%" : "100%",
              position: "relative"
            }}>
              <img
                src={items[showItemDetails].photo}
                alt={items[showItemDetails].name}
                style={{ 
                  width: "100%",
                  height: "100%",
                  objectFit: "cover"
                }}
              />
            </div>
            <div style={{ 
              padding: "40px", 
              width: isMobile ? "100%" : "50%", 
              height: isMobile ? "60%" : "100%",
              overflowY: "auto" 
            }}>
              <h3>{items[showItemDetails].name}</h3>
              <p><strong>Пол:</strong> {items[showItemDetails].gender}</p>
              <p><strong>Возраст:</strong> {items[showItemDetails].age}</p>
              <p><strong>Описание:</strong> {items[showItemDetails].description}</p>
              <div style={{ 
                display: "flex", 
                flexDirection: isSmallMobile ? "column" : "row",
                gap: isSmallMobile ? "5px" : "20px",
                marginBottom: "10px"
              }}>
                <p><strong>Стерилизован:</strong> {items[showItemDetails].sterilized ? "Да" : "Нет"}</p>
                <p><strong>К лотку приучен:</strong> {items[showItemDetails].litterTrained ? "Да" : "Нет"}</p>
              </div>
              <p><strong>Дополнительно:</strong> {items[showItemDetails].additional}</p>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно добавления нового питомца */}
      {showNewForm && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
        }}>
          <div style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            backgroundColor: "#fff",
            width: "80%",
            height: "80%",
            borderRadius: "12px",
            position: "relative",
            overflow: "hidden"
          }}>
            <button
              onClick={() => setShowNewForm(false)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "transparent",
                border: "none",
                fontSize: "20px",
                cursor: "pointer",
                zIndex: 1
              }}
            >
              <FaTimes color="#ef4444" />
            </button>
            <div style={{ 
              width: isMobile ? "100%" : "50%", 
              height: isMobile ? "40%" : "100%",
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f3f4f6"
            }}>
              {newItem.photo ? (
                <>
                  <img 
                    src={newItem.photo} 
                    alt="Предпросмотр" 
                    style={{ 
                      width: "100%",
                      height: "100%",
                      objectFit: "cover" 
                    }} 
                  />
                  <button
                    onClick={removeUploadedPhoto}
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      background: "rgba(255,255,255,0.8)",
                      border: "none",
                      borderRadius: "50%",
                      padding: "5px",
                      cursor: "pointer"
                    }}
                  >
                    <FaTimes color="#ef4444" />
                  </button>
                </>
              ) : (
                <>
                  <FaPlus size={80} color="#9ca3af" />
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    style={{ 
                      position: "absolute", 
                      width: "100%", 
                      height: "100%", 
                      opacity: 0, 
                      cursor: "pointer" 
                    }} 
                  />
                </>
              )}
            </div>
            <div style={{ 
              padding: "40px", 
              width: isMobile ? "100%" : "50%", 
              height: isMobile ? "60%" : "100%",
              overflowY: "auto" 
            }}>
              <input 
                name="name" 
                placeholder="Имя" 
                value={newItem.name} 
                onChange={handleItemInput} 
                style={{ 
                  width: "100%", 
                  padding: "8px", 
                  marginBottom: "10px" 
                }} 
              />
              <div style={{ marginBottom: "10px" }}>
                <label><input type="radio" name="gender" value="Мальчик" checked={newItem.gender === "Мальчик"} onChange={handleItemInput} /> Мальчик</label>
                <label style={{ marginLeft: "20px" }}><input type="radio" name="gender" value="Девочка" checked={newItem.gender === "Девочка"} onChange={handleItemInput} /> Девочка</label>
              </div>
              <input 
                name="age" 
                placeholder="Возраст" 
                value={newItem.age} 
                onChange={handleItemInput} 
                style={{ 
                  width: "100%", 
                  padding: "8px", 
                  marginBottom: "10px" 
                }} 
              />
              <input 
                name="description" 
                placeholder="Главная черта характера" 
                value={newItem.description} 
                onChange={handleItemInput} 
                style={{ 
                  width: "100%", 
                  padding: "8px", 
                  marginBottom: "10px" 
                }} 
              />
              <div style={{ 
                display: "flex", 
                flexDirection: isSmallMobile ? "column" : "row",
                gap: isSmallMobile ? "5px" : "20px",
                marginBottom: "10px"
              }}>
                <label><input type="checkbox" name="sterilized" checked={newItem.sterilized} onChange={handleItemInput} /> Стерилизован</label>
                <label><input type="checkbox" name="litterTrained" checked={newItem.litterTrained} onChange={handleItemInput} /> Приучен к лотку</label>
              </div>
              <textarea 
                name="additional" 
                placeholder="Дополнительная информация" 
                value={newItem.additional} 
                onChange={handleItemInput} 
                style={{ 
                  width: "100%", 
                  padding: "8px", 
                  marginBottom: "10px" 
                }} 
              />
              <button 
                onClick={addItem} 
                style={{ 
                  backgroundColor: "#10b981", 
                  color: "white", 
                  padding: "10px 20px", 
                  borderRadius: "8px", 
                  border: "none", 
                  cursor: "pointer" 
                }}
              >
                Добавить питомца
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;