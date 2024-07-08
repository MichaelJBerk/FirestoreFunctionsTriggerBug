import { getFirestore } from 'firebase-admin/firestore'
import * as functions from 'firebase-functions/v1'
import {onDocumentWritten} from 'firebase-functions/v2/firestore'

export const myOnWriteTrigger = onDocumentWritten("items/{itemid}", async (event) => {
	console.log(event.data.after.data())
	if (event.data?.after?.data() == null) {
		console.log("after is null")
		return
	}
	const db = getFirestore()
	const doc = db.doc(event.document)
	const curr = await doc.get()
	console.log(curr.data())
	const afterData = event.data.after.data()
	if (afterData.name.includes("My")) {
		const newName = afterData.name.replace("My", "")
		await event.data.after.ref.update({name: newName})
	}
	return	
})

export const v1MyOnWriteTrigger = functions.firestore.document("v1/v1/items/{itemid}").onWrite(async (doc, ctx) => {
	console.log(doc.after.data())
	if (doc?.after?.data() == null) {
		console.log("after is null")
		return
	}
	const db = getFirestore()
	const doc1 = db.doc(doc.after.ref.path)
	const curr = await doc1.get()
	console.log(curr.data())
	const afterData = doc.after.data()!
	if (afterData.name.includes("My")) {
		const newName = afterData.name.replace("My", "")
		await doc.after.ref.update({ name: newName })
	}
	return	

})