import assert from 'assert'
import { notImplemented } from './util'

describe('notImplemented', () => {
    it('throws', () => {
        assert.throws(notImplemented, /not implemented/i)
    })
})
