// Fixed full-bleed owl photo behind everything, darkened toward the bottom so
// frosted-glass content stays readable on every screen.
export default function Background() {
  return (
    <div aria-hidden className="fixed inset-0 -z-10">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/background.webp')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-hero/30 via-hero/65 to-hero/90" />
    </div>
  )
}
