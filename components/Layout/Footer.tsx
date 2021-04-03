export default function Footer() {
  return (
    <footer>
      <div>
        <span>
          ©{new Date().getFullYear()} <span className="footer-pipe">|</span>{' '}
          <a
            href="https://ulises.codes"
            target="_blank"
            rel="author noreferrer noopener"
          >
            Ulises Himely
          </a>
        </span>
      </div>
    </footer>
  )
}
