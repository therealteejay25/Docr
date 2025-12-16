import Image from 'next/image'
import React from 'react'

const LogoIcon = ({size} : {size : number}) => {
  return (
    <div>
        <Image src="/logoicon.svg" alt="Logo Icon" height={size} width={size} />
    </div>
  )
}

export default LogoIcon