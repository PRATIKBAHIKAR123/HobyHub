import React, { Suspense } from 'react'

import { ReactNode } from 'react';
import PagesNavbar from '../navbar/pages-navbar';

const layout = ({children}: {children: ReactNode}) => {
  return (
    <>
    <Suspense fallback={<div>Loading...</div>}>
    <PagesNavbar />
    <div>{children}</div>
    </Suspense>
    </>
  )
}

export default layout