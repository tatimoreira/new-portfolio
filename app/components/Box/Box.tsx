import * as THREE from 'three'
import React, { useRef, useState } from 'react'
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber'

export default function Box(props: ThreeElements['mesh']) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  useFrame(({ clock }) => {
    const a = clock.elapsedTime
    meshRef.current.rotation.x = a;
    console.log(a)
  })

  //useFrame((state, clock) => (meshRef.current.rotation.x = clock.elapsedTime)
  return (
    <mesh ref={meshRef}>
      <boxGeometry />
      <meshBasicMaterial color="royalblue" />
    </mesh>
  )
}
