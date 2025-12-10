const fs = require('fs');
const yargs = require('yargs');

const argv = yargs
  .option('startDate', {
    alias: ['s', 'start_date'],
    desc: `[yyyy-mm-dd] Sets the first date that is used to generate entries
      from that all following dates will start from`,
    type: 'string',
    nargs: 1,
    default: new Date().toISOString().split('T')[0],
  })
  .option('daysToMock', {
    alias: ['d'],
    desc: 'number of days to mock through',
    type: 'number',
    nargs: 1,
    default: 200,
  })
  .coerce('startDate', arg => {
    const newDate = new Date(Date.parse(arg));
    if (isNaN(newDate)) throw new Error('Invalid Date Format. Must be YYYY-MM-DD');
    return newDate;
  })
  .fail((msg, err) => {
    console.error(msg);
    process.exit(1);
  })
  .alias({
    h: 'help',
  })
  .version(false).argv;

const dataSets = [
  {
    datasetId: '015-BFS-2020Q4-xx',
    dayOfWeek: 1, // 0 = Sunday, 6 = Saturday
    timeOfDay: '1600',
    frequency: 'w', // bw, m, bm, q
    lastDate: null,
  },
  {
    datasetId: '015-BFS-2014Q3-065',
    dayOfWeek: 5, // 0 = Sunday, 6 = Saturday
    timeOfDay: '1400',
    frequency: 'm', // bw, m, bm, q
    lastDate: null,
  },
  {
    datasetId: '015-BFS-2014Q3-056',
    dayOfWeek: 3, // 0 = Sunday, 6 = Saturday
    timeOfDay: '1659',
    frequency: 'w', // bw, m, bm, q
    lastDate: null,
  },
  {
    datasetId: '015-BFS-2014Q1-03',
    dayOfWeek: 5, // 0 = Sunday, 6 = Saturday
    timeOfDay: '0459',
    frequency: 'm', // bw, m, bm, q
    lastDate: null,
  },
  {
    datasetId: '015-BFS-2014Q3-096',
    dayOfWeek: 4, // 0 = Sunday, 6 = Saturday
    timeOfDay: '1400',
    frequency: 'w', // bw, m, bm, q
    lastDate: null,
  },
  {
    datasetId: '015-BFS-2014Q3-074',
    dayOfWeek: 2, // 0 = Sunday, 6 = Saturday
    timeOfDay: '1600',
    frequency: 'm', // bw, m, bm, q
    lastDate: null,
  },
  {
    datasetId: '015-BFS-2014Q1-11',
    dayOfWeek: 4, // 0 = Sunday, 6 = Saturday
    timeOfDay: '1159',
    frequency: 'm', // bw, m, bm, q
    lastDate: null,
  },
  {
    datasetId: '015-BFS-2014Q1-13',
    dayOfWeek: 3, // 0 = Sunday, 6 = Saturday
    timeOfDay: '1659',
    frequency: 'bm', // bw, m, bm, q
    lastDate: null,
  },
  {
    datasetId: '015-BFS-2014Q1-09',
    dayOfWeek: 5, // 0 = Sunday, 6 = Saturday
    timeOfDay: '2300',
    frequency: 'q', // bw, m, bm, q
    lastDate: null,
  },
  {
    datasetId: '015-BFS-2014Q3-071',
    dayOfWeek: 1, // 0 = Sunday, 6 = Saturday
    timeOfDay: '2300',
    frequency: 'w', // bw, m, bm, q
    lastDate: null,
  },
];

const addDays = (date, days) => {
  const copy = new Date(Number(date));
  copy.setDate(date.getDate() + days);
  return copy;
};

const splitByDayOfWeek = arr => {
  const output = Array(7);
  for (let d = 0; d < 7; d++) {
    output[d] = arr.filter(ds => ds.dayOfWeek === d) || [];
  }
  return output;
};

const generateData = (dataset, date) => {
  const formattedDateString = `${date.toISOString().split('T')[0]}`;
  return {
    datasetId: dataset.datasetId,
    date: formattedDateString,
    time: dataset.timeOfDay,
    released: `${formattedDateString === new Date(argv.startDate).toISOString().split('T')[0]}`,
  };
};

const generateReleaseCalendarData = () => {
  const rcDataArray = [];
  const { startDate, daysToMock } = argv;
  const numberOfDaysToGenerate = daysToMock || 200;

  const byDayOfWeek = splitByDayOfWeek(dataSets);

  for (let i = 0; i <= numberOfDaysToGenerate; i++) {
    let targetDate = new Date(startDate);
    targetDate = addDays(targetDate, i);
    const dayOfWeek = targetDate.getDay();

    byDayOfWeek[dayOfWeek].forEach((ds, index, array) => {
      let lastDate = null;

      if (ds.lastDate) lastDate = new Date(ds.lastDate);

      if (ds.frequency === 'w') {
        rcDataArray[rcDataArray.length] = generateData(ds, targetDate);
        byDayOfWeek[dayOfWeek][index].lastDate = targetDate.toISOString();
      } else if (ds.frequency === 'bw' && (ds.lastDate === null || targetDate > addDays(lastDate, 8))) {
        rcDataArray[rcDataArray.length] = generateData(ds, targetDate);
        byDayOfWeek[dayOfWeek][index].lastDate = targetDate.toISOString();
      } else if (ds.frequency === 'm' && (ds.lastDate === null || targetDate >= addDays(lastDate, 29))) {
        rcDataArray[rcDataArray.length] = generateData(ds, targetDate);
        byDayOfWeek[dayOfWeek][index].lastDate = targetDate.toISOString();
      } else if (ds.frequency === 'bm' && (ds.lastDate === null || targetDate >= addDays(lastDate, 58))) {
        rcDataArray[rcDataArray.length] = generateData(ds, targetDate);
        byDayOfWeek[dayOfWeek][index].lastDate = targetDate.toISOString();
      } else if (ds.frequency === 'q' && (ds.lastDate === null || targetDate >= addDays(lastDate, 89))) {
        rcDataArray[rcDataArray.length] = generateData(ds, targetDate);
        byDayOfWeek[dayOfWeek][index].lastDate = targetDate.toISOString();
      }
    });
  }

  return { data: rcDataArray };
};

const releaseCalendarData = generateReleaseCalendarData();
const data = JSON.stringify(releaseCalendarData);
fs.writeFile('src/testData/release-calendar.mock.data.json', data, error => {
  if (error) throw error;
  const sd = new Date(argv.startDate);
  console.info('Release Calendar Mock Data Generated Successfully starting %s for %s days', sd.toISOString().split('T')[0], argv.daysToMock || 200);
});
