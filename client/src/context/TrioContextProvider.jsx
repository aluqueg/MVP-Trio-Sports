import { createContext, useState } from "react"

export const TrioContext = createContext()

export const TrioContextProvider = ({children}) => {

  const [user,setUser] = useState({})

  return (
    <>
      <TrioContext.Provider value={{user,setUser}}>
        {children}
      </TrioContext.Provider>
    </>
  )
}
