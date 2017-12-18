import { expectSaga } from 'redux-saga-test-plan';
import testVectorParserSaga from '../../app/sagas/testvectorparser';

it('Can read a file', () =>
  expectSaga(testVectorParserSaga)
    .put({ // expect loaded file
      type: 'TESTVECTOR_LOADFILE_PASSED',
      test: {
        alphabet: [
          'a',
          'b'
        ],
        states: [
          'A',
          'B'
        ],
        final: [
          'B'
        ],
        transitions: [
          {
            from: 'A',
            character: 'a',
            to: 'A',
            stackFrom: '_',
            stackTo: '_',
          },
          {
            from: 'A',
            character: 'b',
            to: 'B',
            stackFrom: '_',
            stackTo: '_',
          },
          {
            from: 'B',
            character: 'b',
            to: 'B',
            stackFrom: '_',
            stackTo: '_',
          },
          {
            from: 'B',
            character: 'a',
            to: 'A',
            stackFrom: '_',
            stackTo: '_',
          }
        ],
        expectedDfa: true,
        expectedInfinite: true,
        expectedWords: [
          [
            'aaaa',
            true
          ],
          [
            'bbbbbb',
            true
          ]
        ]
      }
    })
    .put({ // Expect after loaded file to be transformed to statemachine
      type: 'STATEMACHINE_LOADED',
      statemachine: {
        alphabet: [
          'a',
          'b'
        ],
        states: {
          A: {
            initial: true,
            final: false,
            transitions: [
              {
                character: 'a',
                to: 'A',
                stackFrom: '_',
                stackTo: '_',
              },
              {
                character: 'b',
                to: 'B',
                stackFrom: '_',
                stackTo: '_',
              }
            ]
          },
          B: {
            initial: false,
            final: true,
            transitions: [
              {
                character: 'b',
                to: 'B',
                stackFrom: '_',
                stackTo: '_',
              },
              {
                character: 'a',
                to: 'A',
                stackFrom: '_',
                stackTo: '_',
              }
            ]
          }
        }
      }
    })
    .dispatch({ // Call to load file
      type: 'TESTVECTOR_LOADFILE',
      filename: 'dfa'
    })
    .run());
