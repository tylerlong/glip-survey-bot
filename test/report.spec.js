/* eslint-env jest */
import json2csv from 'json2csv'

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

    const json2csvParser = new json2csv.Parser()
    const csv = json2csvParser.parse(myCars)

    console.log(csv)
  })
})
