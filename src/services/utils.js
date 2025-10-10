// Helper functions
const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min, max, decimals = 3) =>
  parseFloat((Math.random() * (max - min) + min).toFixed(decimals));

const browsers = [
  { name: 'Chrome', versions: ['120.0.0', '119.0.0', '118.0.0'], engine: 'Blink' },
  { name: 'Firefox', versions: ['121.0', '120.0', '119.0'], engine: 'Gecko' },
  { name: 'Safari', versions: ['17.2', '17.1', '17.0'], engine: 'WebKit' },
  { name: 'Edge', versions: ['120.0.0', '119.0.0'], engine: 'Blink' },
];

const locations = [
  { country: 'US', city: 'New York', region: 'NY', timezone: 'America/New_York' },
  { country: 'US', city: 'Los Angeles', region: 'CA', timezone: 'America/Los_Angeles' },
  { country: 'US', city: 'Chicago', region: 'IL', timezone: 'America/Chicago' },
  { country: 'GB', city: 'London', region: 'England', timezone: 'Europe/London' },
  { country: 'DE', city: 'Berlin', region: 'Berlin', timezone: 'Europe/Berlin' },
  { country: 'FR', city: 'Paris', region: 'Île-de-France', timezone: 'Europe/Paris' },
  { country: 'JP', city: 'Tokyo', region: 'Tokyo', timezone: 'Asia/Tokyo' },
  { country: 'AU', city: 'Sydney', region: 'NSW', timezone: 'Australia/Sydney' },
  { country: 'BR', city: 'São Paulo', region: 'SP', timezone: 'America/Sao_Paulo' },
  { country: 'CA', city: 'Toronto', region: 'ON', timezone: 'America/Toronto' },
];

const deviceTypes = ['desktop', 'mobile', 'tablet'];
const osTypes = ['macOS', 'Windows', 'Linux', 'iOS', 'Android'];
const connectionTypes = ['4g', '3g', 'wifi', '5g'];

const screenResolutions = [
  '1920x1080', '1366x768', '1440x900', '1536x864', '1280x720',
  '2560x1440', '3840x2160', '1024x768'
];

const viewports = [
  '1440x900', '1366x768', '1280x800', '1920x1080', '1024x768',
  '375x667', '414x896', '360x640', '768x1024'
];

// Generate random IP
const generateIP = () => {
  return `${randomBetween(1, 255)}.${randomBetween(0, 255)}.${randomBetween(0, 255)}.${randomBetween(1, 255)}`;
};

// Generate Web Vitals data with realistic variations
const generateWebVitals = () => {
  // Simulate different performance scenarios
  const scenario = Math.random();

  if (scenario < 0.7) {
    // Good performance (70%)
    return {
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
    return {
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
    return {
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
};

// Generate a single record
const generateRecord = (timestamp, appName) => {
  const browser = browsers[randomBetween(0, browsers.length - 1)];
  const location = locations[randomBetween(0, locations.length - 1)];
  const deviceType = deviceTypes[randomBetween(0, deviceTypes.length - 1)];

  return {
    datetime: timestamp.toISOString(),
    appName: appName,
    data: generateWebVitals(),
    metadata: {
      browser: {
        name: browser.name,
        version: browser.versions[randomBetween(0, browser.versions.length - 1)],
        engine: browser.engine,
        userAgent: `Mozilla/5.0 (${osTypes[randomBetween(0, osTypes.length - 1)]}) AppleWebKit/537.36 (KHTML, like Gecko) ${browser.name}/${browser.versions[0]}`
      },
      location: {
        country: location.country,
        city: location.city,
        region: location.region,
        timezone: location.timezone,
        ip: generateIP()
      },
      device: {
        type: deviceType,
        os: osTypes[randomBetween(0, osTypes.length - 1)],
        screenResolution: screenResolutions[randomBetween(0, screenResolutions.length - 1)],
        viewport: viewports[randomBetween(0, viewports.length - 1)]
      },
      connection: {
        type: connectionTypes[randomBetween(0, connectionTypes.length - 1)],
        downlink: randomBetween(1, 50),
        rtt: randomBetween(20, 300)
      }
    }
  };
};

// Generate all records
export const generateMockData = (appName, startDateTime, endDateTime, totalRecords) => {
  const records = [];
  const startDate = new Date(startDateTime);
  const endDate = new Date(endDateTime);
  const timeSpan = endDate.getTime() - startDate.getTime();
  const timeIncrement = timeSpan / totalRecords;

  for (let i = 0; i < totalRecords; i++) {
    // Distribute records evenly across the time span with some randomness
    const baseTime = startDate.getTime() + (timeIncrement * i);
    const randomOffset = randomBetween(-timeIncrement / 2, timeIncrement / 2);
    const timestamp = new Date(baseTime + randomOffset);

    records.push(generateRecord(timestamp, appName));
  }

  // Sort by datetime
  records.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

  // Calculate days span for metadata
  const daysSpan = Math.ceil(timeSpan / (24 * 60 * 60 * 1000));

  return {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    totalRecords: totalRecords,
    dateRange: {
      start: records[0].datetime,
      end: records[records.length - 1].datetime,
      daysSpan: daysSpan
    },
    records: records
  };
};