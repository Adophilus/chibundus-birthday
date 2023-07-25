import { create } from 'zustand'
import { combine, devtools, persist } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"

const useAppStore = create(
  devtools(
    persist(
      immer(
        combine({
          hasJoinedDiscord: false,
          hasSentFunds: false
        }, (set) => ({
          updateHasJoinedDiscord(newValue: boolean) {
            set(state => {
              state.hasJoinedDiscord = newValue
            })
          },
          updateHasSentFunds(newValue: boolean) {
            set(state => {
              state.hasSentFunds = newValue
            })
          }
        }))
      ),
      {
        name: "app_store"
      }
    )
  )
)

export default useAppStore
