import Link from "next/link";
import { ArrowRight } from "@/components/icons";

export default function NotFound() {
  return (
    <section className="not-found shell" data-reveal="up">
      <p className="error-code">404</p>
      <h1>Page not found</h1>
      <p>The link may be outdated, or the project may have moved.</p>
      <Link className="button button-primary" href="/">Return home <ArrowRight /></Link>
    </section>
  );
}
