import assert from 'assert'
import { notImplemented } from './util'

describe('notImplemted', () => {
    it('throws', () => {
        assert.throws(notImplemented, /not implemented/i)
    })
})
