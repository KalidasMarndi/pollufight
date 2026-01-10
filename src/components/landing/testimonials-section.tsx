const testimonials = [
  {
    initial: "प्र",
    name: "Priya Sharma",
    role: "Resident, Mumbai",
    quote: "The pothole near my house was fixed within 3 days of reporting. Amazing response time!",
  },
  {
    initial: "र",
    name: "Rajesh Kumar",
    role: "Municipal Engineer, Delhi",
    quote: "This platform has revolutionized how we handle citizen complaints. Much more efficient now.",
  },
  {
    initial: "अ",
    name: "Anita Patel",
    role: "Teacher, Pune",
    quote: "Finally, a way to make our voices heard! The app is so easy to use, even my students can report issues.",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">What People Are Saying</h2>
          <p className="text-lg text-muted-foreground">Real stories from citizens and municipal officials</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial) => (
            <div key={testimonial.name} className="bg-card rounded-2xl p-6 shadow-sm border border-border">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-emerald/10 flex items-center justify-center text-emerald font-bold text-lg">
                  {testimonial.initial}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
