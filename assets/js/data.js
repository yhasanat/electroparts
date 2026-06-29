const EP_DEFAULT_CATEGORIES = [
  { id: 'arduino', name: 'Arduino', icon: '⚙️' },
  { id: 'esp', name: 'ESP32 / ESP8266', icon: '📡' },
  { id: 'sensors', name: 'Sensors', icon: '🌡️' },
  { id: 'raspberry', name: 'Raspberry Pi', icon: '🍓' },
  { id: 'power', name: 'Power & Batteries', icon: '🔋' },
  { id: 'tools', name: 'Tools & Lab', icon: '🛠️' },
  { id: 'components', name: 'Electronic Components', icon: '🔩' },
  { id: 'kits', name: 'Training Kits', icon: '🎓' }
];

const EP_DEFAULT_PRODUCTS = [
  {
    id: 'p-esp32-wroom', sku: 'ESP32-WROOM-001', nameAr: 'لوحة تطوير ESP32 WROOM', nameEn: 'ESP32-WROOM Development Board',
    category: 'esp', brand: 'Generic', price: 35, cost: 22, stock: 24, status: 'available', featured: true,
    voltage: '3.3V', interface: 'WiFi, Bluetooth, UART', compatibility: 'Arduino IDE, MicroPython, ESP-IDF',
    description: 'لوحة تطوير مناسبة لمشاريع إنترنت الأشياء والتحكم اللاسلكي والمنزل الذكي.',
    image: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=900&q=80',
    datasheet: 'https://www.espressif.com/sites/default/files/documentation/esp32-wroom-32_datasheet_en.pdf'
  },
  {
    id: 'p-arduino-uno', sku: 'ARD-UNO-R3-001', nameAr: 'Arduino Uno R3 متوافق', nameEn: 'Arduino Uno R3 Compatible Board',
    category: 'arduino', brand: 'Compatible', price: 45, cost: 30, stock: 18, status: 'available', featured: true,
    voltage: '5V', interface: 'USB, Digital, Analog, I2C, SPI', compatibility: 'Arduino IDE',
    description: 'لوحة تعليمية وعملية لبداية مشاريع الإلكترونيات والتحكم.',
    image: 'https://images.unsplash.com/photo-1603732551658-5fabbafa84eb?auto=format&fit=crop&w=900&q=80',
    datasheet: ''
  },
  {
    id: 'p-dht22', sku: 'SEN-DHT22-001', nameAr: 'حساس حرارة ورطوبة DHT22', nameEn: 'DHT22 Temperature & Humidity Sensor',
    category: 'sensors', brand: 'Aosong Compatible', price: 28, cost: 16, stock: 30, status: 'available', featured: false,
    voltage: '3.3V - 5V', interface: 'Digital', compatibility: 'Arduino, ESP32, Raspberry Pi',
    description: 'حساس مناسب لقياس درجة الحرارة والرطوبة في مشاريع المراقبة البيئية.',
    image: 'https://images.unsplash.com/photo-1581092921461-39b9d08a9b21?auto=format&fit=crop&w=900&q=80',
    datasheet: ''
  },
  {
    id: 'p-hcsr04', sku: 'SEN-HCSR04-001', nameAr: 'حساس مسافة Ultrasonic HC-SR04', nameEn: 'HC-SR04 Ultrasonic Distance Sensor',
    category: 'sensors', brand: 'Generic', price: 12, cost: 6, stock: 40, status: 'available', featured: true,
    voltage: '5V', interface: 'Trigger/Echo Digital', compatibility: 'Arduino, ESP32 with level shifting',
    description: 'حساس قياس مسافة مناسب للروبوتات والأنظمة التعليمية.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
    datasheet: ''
  },
  {
    id: 'p-raspberry-pico-w', sku: 'RPI-PICO-W-001', nameAr: 'Raspberry Pi Pico W', nameEn: 'Raspberry Pi Pico W',
    category: 'raspberry', brand: 'Raspberry Pi', price: 55, cost: 40, stock: 8, status: 'available', featured: true,
    voltage: '3.3V', interface: 'WiFi, GPIO, I2C, SPI, UART', compatibility: 'MicroPython, C/C++ SDK',
    description: 'لوحة صغيرة وقوية مع WiFi للمشاريع التعليمية وإنترنت الأشياء.',
    image: 'https://images.unsplash.com/photo-1580894894513-541e068a3e2b?auto=format&fit=crop&w=900&q=80',
    datasheet: ''
  },
  {
    id: 'p-lm2596', sku: 'PWR-LM2596-001', nameAr: 'منظم جهد LM2596 Buck Converter', nameEn: 'LM2596 DC-DC Buck Converter',
    category: 'power', brand: 'Generic', price: 10, cost: 5, stock: 50, status: 'available', featured: false,
    voltage: 'Input up to 40V', interface: 'Screw Terminal', compatibility: 'General Electronics',
    description: 'منظم جهد خافض مناسب لتغذية لوحات Arduino وESP والحساسات.',
    image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=900&q=80',
    datasheet: ''
  },
  {
    id: 'p-soldering-kit', sku: 'TOOL-SOLDER-001', nameAr: 'عدة لحام إلكترونيات تعليمية', nameEn: 'Electronics Soldering Starter Kit',
    category: 'tools', brand: 'Generic', price: 95, cost: 65, stock: 6, status: 'available', featured: false,
    voltage: '220V', interface: 'Manual Tool', compatibility: 'Lab & Repair',
    description: 'عدة مناسبة للتدريب والصيانة الخفيفة ومشاريع الطلبة.',
    image: 'https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=900&q=80',
    datasheet: ''
  },
  {
    id: 'p-iot-kit', sku: 'KIT-IOT-ESP32-001', nameAr: 'حقيبة تدريب ESP32 IoT', nameEn: 'ESP32 IoT Training Kit',
    category: 'kits', brand: 'ElectroParts', price: 220, cost: 155, stock: 5, status: 'available', featured: true,
    voltage: '3.3V / 5V', interface: 'WiFi, Sensors, Relay, OLED', compatibility: 'Arduino IDE, MicroPython',
    description: 'حقيبة تدريب تشمل ESP32 وحساسات ووحدة ريليه وشاشة OLED وأسلاك ولوحة تجارب.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
    datasheet: ''
  }
];
