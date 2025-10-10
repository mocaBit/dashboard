/**
 * WebSocket Service Simulator for real-time Web Vitals data
 * Simulates WebSocket behavior by generating new Web Vitals records in real-time
 */

const UPDATE_INTERVAL = 2000; // Generate new data every 2 seconds

// Helper functions to generate realistic Web Vitals values
const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min, max, decimals = 3) =>
  parseFloat((Math.random() * (max - min) + min).toFixed(decimals));

/**
 * Generate realistic Web Vitals data based on performance scenarios
 */
const generateWebVitalsRecord = () => {
  const scenario = Math.random();

  let metrics;
  if (scenario < 0.7) {
    // Good performance (70%)
    metrics = {
      LCP: randomBetween(1200, 2500),
      FID: randomBetween(50, 100),
      CLS: randomFloat(0.01, 0.1),
      FCP: randomBetween(800, 1800),
      TTFB: randomBetween(200, 600),
      INP: randomBetween(80, 200),
      TBT: randomBetween(150, 400),
      SI: randomBetween(1500, 2500),
      TTI: randomBetween(2000, 3500)
    };
  } else if (scenario < 0.9) {
    // Needs improvement (20%)
    metrics = {
      LCP: randomBetween(2500, 4000),
      FID: randomBetween(100, 300),
      CLS: randomFloat(0.1, 0.25),
      FCP: randomBetween(1800, 3000),
      TTFB: randomBetween(600, 1500),
      INP: randomBetween(200, 500),
      TBT: randomBetween(400, 800),
      SI: randomBetween(2500, 4500),
      TTI: randomBetween(3500, 6000)
    };
  } else {
    // Poor performance (10%)
    metrics = {
      LCP: randomBetween(4000, 8000),
      FID: randomBetween(300, 600),
      CLS: randomFloat(0.25, 0.5),
      FCP: randomBetween(3000, 5000),
      TTFB: randomBetween(1500, 3000),
      INP: randomBetween(500, 1000),
      TBT: randomBetween(800, 1500),
      SI: randomBetween(4500, 8000),
      TTI: randomBetween(6000, 10000)
    };
  }

  const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge'];
  const deviceTypes = ['desktop', 'mobile', 'tablet'];
  const countries = ['US', 'GB', 'DE', 'FR', 'JP', 'AU', 'BR', 'CA'];

  return {
    datetime: new Date().toISOString(),
    appName: 'crypto-dashboard',
    data: metrics,
    metadata: {
      browser: {
        name: browsers[randomBetween(0, browsers.length - 1)],
        version: `${randomBetween(110, 120)}.0.0`
      },
      location: {
        country: countries[randomBetween(0, countries.length - 1)]
      },
      device: {
        type: deviceTypes[randomBetween(0, deviceTypes.length - 1)]
      },
      connection: {
        type: ['4g', '3g', 'wifi', '5g'][randomBetween(0, 3)]
      }
    }
  };
};

/**
 * WebSocket Simulator class
 */
class WebSocketSimulator {
  constructor(onMessage, onError) {
    this.onMessage = onMessage;
    this.onError = onError;
    this.intervalId = null;
    this.isConnected = false;
  }

  connect() {
    if (this.isConnected) return;

    this.isConnected = true;
    console.log('WebSocket Simulator: Connected - Generating real-time Web Vitals data');

    // Simulate connection delay
    setTimeout(() => {
      if (this.onOpen) this.onOpen();
    }, 100);

    // Start generating data
    this.intervalId = setInterval(() => {
      if (this.isConnected) {
        const record = generateWebVitalsRecord();
        console.log('WebSocket Simulator: New Web Vitals record generated', record);
        this.onMessage(record);
      }
    }, UPDATE_INTERVAL);
  }

  close() {
    if (!this.isConnected) return;

    this.isConnected = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    console.log('WebSocket Simulator: Disconnected');
    if (this.onClose) this.onClose();
  }

  addEventListener(event, callback) {
    if (event === 'open') {
      this.onOpen = callback;
    } else if (event === 'close') {
      this.onClose = callback;
    } else if (event === 'error') {
      this.onError = callback;
    }
  }

  get readyState() {
    return this.isConnected ? 1 : 0; // 1 = OPEN, 0 = CONNECTING/CLOSED
  }
}

/**
 * Creates a simulated WebSocket connection for real-time Web Vitals data
 * @param {Function} onMessage - Callback function for incoming messages
 * @param {Function} onError - Callback function for errors
 * @returns {WebSocketSimulator} WebSocket simulator instance
 */
export const createWebVitalsWebSocket = (onMessage, onError) => {
  const simulator = new WebSocketSimulator(onMessage, onError);
  simulator.connect();
  return simulator;
};

/**
 * Safely closes a WebSocket connection
 * @param {WebSocketSimulator} ws - WebSocket simulator instance to close
 */
export const closeWebSocket = (ws) => {
  if (ws && ws.readyState === 1) {
    ws.close();
  }
};
