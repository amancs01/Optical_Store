import { SITE_CONFIG } from "@/lib/constants";

export default function AboutPage() {
  return <PolicyPage title="About Optical Store" body={`${SITE_CONFIG.name} helps customers in Kathmandu choose comfortable, stylish eyewear with practical guidance on frames, lenses, fit, and eye checkup booking.`} />;
}

function PolicyPage({ title, body }: { title: string; body: string }) {
  return <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8"><h1 className="text-4xl font-black">{title}</h1><p className="mt-5 leading-8 text-slate-600">{body}</p></div>;
}
