import { useId, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, X } from 'lucide-react'
import { useContent } from '../lib/content'

export default function FAQ() {
  const id = useId()
  const [openIndex, setOpenIndex] = useState(1)
  const visit = useContent('visit')
  const tickets = useContent('tickets')
  const adultEntry = tickets.items?.find(item => item.id === 'entry-adult')
  const questions = [
    {
      question: 'Do I need to book before visiting?',
      answer: <p>{visit.body || 'Walk-ins are welcome across the grounds. Book online for tables, day passes, walkthroughs and stays, or reach out for anything custom.'}</p>,
    },
    {
      question: 'What can I book online?',
      answer: <><p>Choose entry tickets, family and celebration packages, group visits, tables, rooms and stays, Beach Club day passes or an Upside-Down Walkthrough.</p><p>Pick your preferred date and party size, then review your details before sending a request.</p><Link to="/bookings" className="inline-flex min-h-11 items-center font-medium text-marine underline underline-offset-4 hover:text-orange-dark transition-colors">Explore booking options</Link></>,
    },
    {
      question: 'What does an entry ticket include?',
      answer: <><p>{adultEntry?.body || 'Grounds entry gives you access to the Ring, the Green and the waterfront approach to explore at your own pace.'}</p><p>Paid activities, Beach Club passes and packages are listed separately, so you can choose what you would like to add to your visit.</p></>,
    },
    {
      question: 'Are there options for families and groups?',
      answer: <><p>Family entry includes two adults and two children. The family day package brings together entry, an activity per person and a reserved seafood table for four.</p><p>Group bookings are available for 20 or more guests. You can add your party size and any special requests when you book.</p><Link to="/bookings/group" className="inline-flex min-h-11 items-center font-medium text-marine underline underline-offset-4 hover:text-orange-dark transition-colors">Plan a group visit</Link></>,
    },
    {
      question: 'How is my booking confirmed?',
      answer: <><p>After your request is received, you will see a booking reference. Keep it for any follow-up.</p><p>Our team will confirm availability and payment details using the contact information you provide. Sending a booking request does not take a payment.</p></>,
    },
    {
      question: 'Can you help with a special request?',
      answer: <><p>Add access needs, celebration plans or other requests in the notes field when booking. For a custom visit, wedding or private event, tell our team what you have in mind.</p><Link to="/bookings/other" className="inline-flex min-h-11 items-center font-medium text-marine underline underline-offset-4 hover:text-orange-dark transition-colors">Plan a custom visit</Link></>,
    },
  ]

  return (
    <div id="faqs" aria-labelledby={`${id}-title`} className="relative z-10 max-w-4xl mx-auto">
        <div className="text-center mb-10 md:mb-14">
          <p className="text-xs uppercase tracking-widest2 text-orange-dark mb-4">FAQs</p>
          <h2 id={`${id}-title`} className="font-display text-marine-dark tracking-tight leading-tight" style={{ fontSize: 'clamp(2.25rem, 5vw, 3.75rem)' }}>Common questions.</h2>
        </div>
        <div className="space-y-3">
          {questions.map(({ question, answer }, index) => {
            const open = openIndex === index
            const questionId = `${id}-question-${index}`
            const answerId = `${id}-answer-${index}`
            return (
              <article key={question} className={`rounded-3xl border transition-colors duration-200 ${open ? 'border-marine/30 bg-white/75' : 'border-marine-dark/10 bg-white/35 hover:border-marine-dark/25'}`}>
                <h3>
                  <button id={questionId} type="button" aria-expanded={open} aria-controls={answerId} onClick={() => setOpenIndex(open ? null : index)} className="w-full rounded-full flex items-center justify-between gap-5 px-5 sm:px-7 py-5 text-left text-base font-medium text-marine-dark">
                    <span>{question}</span>
                    <span aria-hidden="true" className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center ${open ? 'border border-marine-dark/20 text-marine-dark' : 'bg-marine-dark text-sand'}`}>{open ? <X size={17} strokeWidth={1.5} /> : <Plus size={18} strokeWidth={1.5} />}</span>
                  </button>
                </h3>
                <div id={answerId} role="region" aria-labelledby={questionId} hidden={!open} className="px-5 sm:px-7 pb-6 sm:pb-7">
                  <div className="max-w-2xl space-y-3 text-sm sm:text-base leading-relaxed text-marine-dark/75">{answer}</div>
                </div>
              </article>
            )
          })}
        </div>
    </div>
  )
}
