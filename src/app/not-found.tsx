import Link from 'next/link';

    export default function NotFound() {
      return (
        <div style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          color: '#333',
          textAlign: 'center',
          padding: '50px',
        }}>
          <h1 style={{ fontSize: '50px' }}>Page Not Found</h1>
          <div>
            <p>Sorry, but the page you were trying to view does not exist.</p>
            <p>
              <Link href="/">
                Go back to the home page
              </Link>
            </p>
          </div>
        </div>
      );
    }