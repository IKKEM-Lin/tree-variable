import { FC } from "react"

export const LayoutIcon: FC<{size: number, rotate: number}> = ({size, rotate}) => {
  return <svg xmlns="http://www.w3.org/2000/svg" height={size} viewBox="0 0 100 100" focusable="false" fill="currentColor"  width={size} style={{transform: `translate(0, 4px) rotate(${rotate}deg) scale(1,1.2)`, transformOrigin: "center"}}>
  <path d="m85.49049,75.60963l0,-20.20321l-70.71123,0l0,20.20321l70.71123,0zm0,-30.30481l0,-20.20321l-70.71123,0l0,20.20321l70.71123,0zm-70.71123,40.40642q-4.16691,0 -7.13426,-2.96735t-2.96735,-7.13426l0,-50.50802q0,-4.16691 2.96735,-7.13426t7.13426,-2.96735l70.71123,0q4.16691,0 7.13426,2.96735t2.96735,7.13426l0,50.50802q0,4.16691 -2.96735,7.13426t-7.13426,2.96735l-70.71123,0z"/>
</svg>
}
