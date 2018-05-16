/* eslint-env jest */
import fs from 'fs'
import path from 'path'

import { parse } from '../src/parser'

describe('parser', () => {
  test('parse', () => {
    const markdown = fs.readFileSync(path.join(__dirname, '..', '/survey.md'), 'utf-8')
    const result = parse(markdown)
    expect(result).toEqual([ [ 'h1', {}, 'My awesome survey' ],
      [ 'p',
        {},
        'Hi there, here I am conducting a survey. I will ask you some questions. For each question please choose your answer from a predefined list by replying with 1, 2, 3...etc.' ],
      [ 'p',
        {},
        'At the end of the survey, we will ask you two questions about your t-shirt size and your gender, because we want to offer you a t-shirt for free!' ],
      [ 'h2', {}, 'Which color do you like?' ],
      [ 'ul',
        {},
        [ 'li', {}, 'Red' ],
        [ 'li', {}, 'Green' ],
        [ 'li', {}, 'Blue' ],
        [ 'li', {}, 'Yello' ] ],
      [ 'h2', {}, 'Which pet do you like?' ],
      [ 'ul',
        {},
        [ 'li', {}, 'Dog' ],
        [ 'li', {}, 'Cat' ],
        [ 'li', {}, 'Fish' ],
        [ 'li', {}, 'Bird' ] ],
      [ 'h2', {}, 'Which t-shirt size do you want?' ],
      [ 'ul',
        {},
        [ 'li', {}, 'extra small, XS' ],
        [ 'li', {}, 'small, S' ],
        [ 'li', {}, 'medium, M' ],
        [ 'li', {}, 'large, L' ],
        [ 'li', {}, 'extra large, XL' ],
        [ 'li', {}, 'double extra large, XXL' ],
        [ 'li', {}, 'triple extra large, XXXL' ] ],
      [ 'h2', {}, 'What is your gender?' ],
      [ 'ul', {}, [ 'li', {}, 'Male' ], [ 'li', {}, 'Female' ] ],
      [ 'p',
        {},
        'Thank you very much for your input! Bye for now and see you next time!' ] ])
  })
})
