/* eslint-env jest */
import json2csv from 'json2csv'
import glob from 'glob'
import path from 'path'

describe('demo', () => {
  test('report', async () => {
    const myCars = [
      {
        'car': 'Audi',
        'price': 40000,
        'color': 'blue'
      }, {
        'car': 'BMW',
        'price': 35000,
        'color': 'black'
      }, {
        'car': 'Porsche',
        'price': 60000,
        'color': 'green',
        size: 'large'
      }
    ]

    const json2csvParser = new json2csv.Parser({fields: ['size', 'car']})
    const csv = json2csvParser.parse(myCars)

    console.log(csv)

    glob(path.join(__dirname, '..', 'result', '*.json'), (_, files) => {
      console.log(files)
    })
  })
})
