import 'jest';

import * as crypto from 'node:crypto'
import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import * as firebaseFunctionsTest from 'firebase-functions-test';

export function generateTempId() {
    return 'tmp-' + crypto.randomUUID()
}

process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080'

admin.initializeApp({
    projectId: 'pricetracker-testing',
    credential: admin.credential.applicationDefault()
})

const testEnv = firebaseFunctionsTest({
    projectId: 'pricetracker-testing'
})


const {myOnWriteTrigger, v1MyOnWriteTrigger} = require("../db.ts")

describe("Item Editing", () => {

    test("Write Item V2", async () => {
        const db = getFirestore()
        const path = `items/${generateTempId()}`
        const data = {name: "MyTest"}
        
		await db.doc(path).set(data)
		const wrapped = testEnv.wrap(myOnWriteTrigger)
		const beforeSnap = testEnv.firestore.makeDocumentSnapshot({name:'blah'}, path)
		const afterSnap = testEnv.firestore.makeDocumentSnapshot(data, path)
		const change = testEnv.makeChange(beforeSnap, afterSnap)
        
        //This fails
        await wrapped(change)

        const actual = await db.doc(path).get()
        expect(actual.data()!.name).toBe("Test")
    })
	
	test("Write Item v1", async () => {
		const db = getFirestore()
        const path = `v1/v1/items/${generateTempId()}`
        const data = {name: "MyTest"}
        
		await db.doc(path).set(data)
		const wrapped = testEnv.wrap(v1MyOnWriteTrigger)
		const beforeSnap = testEnv.firestore.makeDocumentSnapshot({name:'blah'}, path)
		const afterSnap = testEnv.firestore.makeDocumentSnapshot(data, path)
		const change = testEnv.makeChange(beforeSnap, afterSnap)
        await wrapped(change)

        const actual = await db.doc(path).get()
        expect(actual.data().name).toBe("Test")
        
    })
})
