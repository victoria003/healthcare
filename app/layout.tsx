import"./globals.css";
import React from"react";
import { Inter } from"next/font/google";
import { ThemeProvider } from"@/components";

const inter = Inter({
 subsets: ["latin"],
 variable:"--font-sans",
 display:"swap",
});

export const metadata = {
 title:"HomeCare Marketplace — Enterprise Healthcare At Your Doorstep",
 description:
"The Airbnb & Uber of Home Healthcare. Connect with verified nursing agencies, certified nurses, caregivers, physiotherapists, and doctors across Andhra Pradesh & Telangana.",
 keywords:
"home healthcare, nursing care, ICU at home, physiotherapy, caregiver, doctor home visit, Andhra Pradesh, Telangana",
};

export default function RootLayout({
 children,
}: {
 children: React.ReactNode;
}) {
 return (
 <html lang="en" className={inter.variable}>
 <head>
 <link
 rel="icon"
 href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>❤️</text></svg>"
 />
 <meta name="theme-color" content="#0F172A" />
 </head>
 <body>
 <ThemeProvider>{children}</ThemeProvider>
 </body>
 </html>
 );
}
