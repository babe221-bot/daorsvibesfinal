import * as esbuild from 'esbuild'

esbuild.build({
  entryPoints: ['public/firebase-messaging-sw.js'],
  bundle: true,
  minify: true,
  format: 'esm',
  outfile: 'public/firebase-messaging-sw.js',
  allowOverwrite: true,
  define: {
    'process.env.NEXT_PUBLIC_FIREBASE_API_KEY': `\"${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}\"`, 
    'process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN': `\"${process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}\"`, 
    'process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL': `\"${process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL}\"`, 
    'process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID': `\"${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}\"`, 
    'process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET': `\"${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}\"`, 
    'process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID': `\"${process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}\"`, 
    'process.env.NEXT_PUBLIC_FIREBASE_APP_ID': `\"${process.env.NEXT_PUBLIC_FIREBASE_APP_ID}\"`, 
    'process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID': `\"${process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID}\"`, 
  },
}).catch(() => process.exit(1))
