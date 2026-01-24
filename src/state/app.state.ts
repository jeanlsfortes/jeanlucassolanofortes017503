import { BehaviorSubject } from 'rxjs'

export interface AppState {
  isInitialized: boolean
  globalLoading: boolean
  notifications: Notification[]
}

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  timestamp: Date
}

const initialState: AppState = {
  isInitialized: false,
  globalLoading: false,
  notifications: [],
}

export const appState$ = new BehaviorSubject<AppState>(initialState)

export const appStateActions = {
  setInitialized: (isInitialized: boolean) => {
    appState$.next({ ...appState$.getValue(), isInitialized })
  },

  setGlobalLoading: (globalLoading: boolean) => {
    appState$.next({ ...appState$.getValue(), globalLoading })
  },

  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const current = appState$.getValue()
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    }
    appState$.next({
      ...current,
      notifications: [...current.notifications, newNotification],
    })
    return newNotification.id
  },

  removeNotification: (id: string) => {
    const current = appState$.getValue()
    appState$.next({
      ...current,
      notifications: current.notifications.filter((n) => n.id !== id),
    })
  },

  clearNotifications: () => {
    appState$.next({ ...appState$.getValue(), notifications: [] })
  },

  reset: () => {
    appState$.next(initialState)
  },
}
