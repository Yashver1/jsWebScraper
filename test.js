import { expect, test, } from '@jest/globals'
import normaliseUrl from './main'

test('normalise url1',()=>{
    expect(normaliseUrl("http://blog.boot.dev/path")).toBe("blog.boot.dev/path")
})

test('normalise url2',()=>{
    expect(normaliseUrl("http://blog.boot.dev/path/")).toBe("blog.boot.dev/path")
})

test('normalise url3',()=>{
    expect(normaliseUrl("https://blog.boot.dev/path")).toBe("blog.boot.dev/path")
})

test('normalise url4',()=>{
    expect(normaliseUrl("https://blog.boot.dev/path/")).toBe("blog.boot.dev/path")
})