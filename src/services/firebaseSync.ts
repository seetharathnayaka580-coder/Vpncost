import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  getDocs 
} from 'firebase/firestore';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { 
  db, 
  auth, 
  googleProvider, 
  OperationType, 
  handleFirestoreError 
} from '../lib/firebase';
import { VpnExpense, ClientSale } from '../types';

export function onAuthUserChanged(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function signInWithGoogle(): Promise<User | null> {
  try {
    const cred = await signInWithPopup(auth, googleProvider);
    return cred.user;
  } catch (error) {
    console.error('Google Sign In Error:', error);
    throw error;
  }
}

export async function logOutUser(): Promise<void> {
  await signOut(auth);
}

// 1. Subscribe to Expenses
export function subscribeExpenses(
  onData: (expenses: VpnExpense[]) => void
) {
  const path = 'expenses';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const items: VpnExpense[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as VpnExpense);
      });
      onData(items);
    },
    (error) => {
      console.warn('Firestore Expenses subscription notice:', error);
    }
  );
}

// 2. Subscribe to Sales
export function subscribeSales(
  onData: (sales: ClientSale[]) => void
) {
  const path = 'sales';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const items: ClientSale[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as ClientSale);
      });
      onData(items);
    },
    (error) => {
      console.warn('Firestore Sales subscription notice:', error);
    }
  );
}

// 3. Write Expense
export async function writeExpenseToFirestore(expense: VpnExpense): Promise<void> {
  const path = `expenses/${expense.id}`;
  try {
    // Filter undefined fields to avoid Firestore errors
    const cleaned = Object.fromEntries(
      Object.entries(expense).filter(([_, v]) => v !== undefined)
    );
    await setDoc(doc(db, 'expenses', expense.id), cleaned);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// 4. Delete Expense
export async function deleteExpenseFromFirestore(id: string): Promise<void> {
  const path = `expenses/${id}`;
  try {
    await deleteDoc(doc(db, 'expenses', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 5. Write Sale
export async function writeSaleToFirestore(sale: ClientSale): Promise<void> {
  const path = `sales/${sale.id}`;
  try {
    const cleaned = Object.fromEntries(
      Object.entries(sale).filter(([_, v]) => v !== undefined)
    );
    await setDoc(doc(db, 'sales', sale.id), cleaned);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// 6. Delete Sale
export async function deleteSaleFromFirestore(id: string): Promise<void> {
  const path = `sales/${id}`;
  try {
    await deleteDoc(doc(db, 'sales', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 7. Bulk Upload / Sync Local Data to Cloud
export async function syncLocalDataToFirestore(
  expenses: VpnExpense[],
  sales: ClientSale[]
): Promise<{ expensesSynced: number; salesSynced: number }> {
  let expensesSynced = 0;
  let salesSynced = 0;

  for (const exp of expenses) {
    await writeExpenseToFirestore(exp);
    expensesSynced++;
  }

  for (const sale of sales) {
    await writeSaleToFirestore(sale);
    salesSynced++;
  }

  return { expensesSynced, salesSynced };
}
