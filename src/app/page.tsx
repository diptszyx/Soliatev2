import Image from 'next/image'

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start">
        <div className="md:w-1/2">
          <h1 className="text-6xl font-bold mb-4 leading-tight">
            Automating<br />
            <span className="text-[#99CF63]">Web3</span> Marketing
          </h1>
          <p className="text-gray-600 mb-6">
            We increase revenue and ensure sustainable long-term growth for your business through powerful Webflow marketing solutions.
          </p>
          <div className="flex space-x-4 mb-8">
            <button className="bg-black text-white px-4 py-2 rounded-full flex items-center">
              Schedule Call
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button className="text-gray-600">View Campaigns</button>
          </div>
          <p className="text-sm text-gray-500 mb-2">Trusted by the world biggest brands</p>
          <div className="flex space-x-4">
            <Image src="/img1.png" alt="Brand 1" width={40} height={40} />
            <Image src="/img2.png" alt="Brand 2" width={40} height={40} />
          </div>
        </div>
        <div className="md:w-1/2 mt-8 md:mt-0">
          <div className="flex mb-6">
            <div className="relative flex-1 bg-gray-200 rounded-tl-[100px] rounded-tr-lg rounded-br-lg rounded-bl-lg p-6 mr-4">
              <div className="absolute -top-6 -right-6 bg-black rounded-full p-3 w-12 h-12 flex items-center justify-center">
                <svg className="w-6 h-6 text-[#99CF63]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <div className="flex-1 bg-gray-100 rounded-lg p-4">
              <span className="text-5xl font-bold text-[#99CF63]">230+</span>
              <p className="text-sm text-gray-600 mt-2">Big companies that we work with</p>
            </div>
          </div>
          <div className="bg-black text-white rounded-2xl p-6 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white opacity-5 rounded-full blur-3xl"></div>
              <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-white opacity-5 rounded-full blur-3xl"></div>
            </div>
            <div className="flex flex-col h-full relative z-10">
              <div className="mb-auto">
                <p className="text-xs text-gray-400 mb-1">Drive More Traffic and Sales</p>
                <h2 className="text-2xl font-bold">
                  Drive more traffic<br />
                  and product sales
                </h2>
              </div>
              <div className="flex justify-end items-end h-32 mt-4">
                <div className="w-12 h-3/5 bg-[#BAE289] rounded-t mx-1"></div>
                <div className="w-12 h-4/5 bg-[#99CF63] rounded-t mx-1"></div>
                <div className="w-12 h-full bg-[#77B248] rounded-t mx-1"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-12">
        <div className="flex flex-col md:flex-row justify-between items-start">
          <div className="md:w-1/2">
            <h2 className="text-4xl font-bold mb-4">
              Get a dedicated<br />
              marketing campaign
            </h2>
          </div>
          <div className="md:w-1/2">
            <p className="text-gray-600 mb-6">
              Boost your brand with automated Web3 campaigns for a flat monthly fee. Access powerful tools like Blink, airdrops, and real-time tracking —no limits.
            </p>
            <button className="bg-[#99CF63] text-white px-6 py-2 rounded-full hover:bg-[#77B248] transition duration-300">
              See Pricing
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4 mt-8">
        <div className="w-full md:w-[30%] bg-black text-white rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute bottom-0 right-0 w-3/4 h-3/4 bg-gray-800 rounded-tl-full"></div>
          <div className="relative z-10">
            <span className="text-5xl font-bold">230<span className="text-[#99CF63]">+</span></span>
            <p className="text-sm text-gray-400 mt-2">Project finish with superbly</p>
            <div className="flex mt-4 space-x-2">
              <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
              <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
              <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
              <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-[#99CF63] font-bold">+</div>
            </div>
          </div>
        </div>
        <div className="w-full md:w-[70%] bg-gray-200 text-black rounded-2xl p-6 flex items-center justify-between">
          <span className="text-2xl font-bold uppercase">How we work</span>
          <div className="w-12 h-12 bg-[#99CF63] rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
      <div className="bg-black text-white rounded-3xl p-8 mt-12">
        <h2 className="text-4xl font-bold mb-8 text-center">OUR WORK</h2>
        
        <div className="flex justify-center space-x-4 mb-8">
          <button className="bg-gray-800 text-white px-4 py-2 rounded-full">All Work [20]</button>
          <button className="bg-[#99CF63] text-black px-4 py-2 rounded-full">UI/UX Design [10]</button>
          <button className="bg-gray-800 text-white px-4 py-2 rounded-full">Digital Marketing [5]</button>
          <button className="bg-gray-800 text-white px-4 py-2 rounded-full">Branding [5]</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-700 rounded-2xl aspect-square flex items-center justify-center">
            <button className="bg-[#99CF63] text-black px-6 py-3 rounded-full font-semibold">
              See Details
            </button>
          </div>
          
          <div className="bg-gray-700 rounded-2xl p-4 flex flex-col justify-between">
            <div className="text-sm text-gray-400">Bonk airdrop, 2024</div>
            <div className="mt-4">
              <Image src="/img3.png" alt="Bonk Icon" width={200} height={200} />
              <p className="text-center font-semibold">Sign in for earning! $BONKKK</p>
            </div>
          </div>
          
          <div className="bg-gray-700 rounded-2xl p-4 flex flex-col justify-between">
            <div className="text-sm text-gray-400">Lancer Corporation, 2023</div>
            <div className="mt-4">
              <p className="text-center font-semibold">App Lancer - Freelance M...</p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white text-black py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start mb-12">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                The marketing subscription that empowers your brand
              </h2>
            </div>
            <div className="md:w-1/2">
              <p className="text-gray-600 mb-6">
                A subscription relieves the burden of manual processes and campaign management. We partner with you to ensure your Web3 marketing reaches new heights and engagement through automation.
              </p>
              <button className="bg-[#99CF63] text-white px-6 py-2 rounded-full">
                See Pricing
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "∞", title: "On-demand requests", description: "Put in your requests, the design queue in Trello, and we'll knock them out 1 by 1." },
              { icon: "⚡", title: "Top-notch quality", description: "High-quality work by a dedicated team of senior designers that's always available when you need it." },
              { icon: "W", title: "Powered by - Webflow", description: "We build every website in Webflow, making them dynamic, accessible, and easily scalable. It's easy for you like Squarespace but better." },
              { icon: "🚀", title: "Fast. Responsive. Reliable.", description: "Get regular updates on your projects and can expect to receive your designs within 2-3 days." },
              { icon: "📅", title: "No Lock in contracts", description: "Pay the same every month, no surprises. You can use it for as long as you want and cancel anytime." },
              { icon: "💰", title: "Great value for money", description: "Get the power of dedicated design team at fraction of the cost of full-time employee ($54k/yr vs. $120k/yr)." },
              { icon: "⚙️", title: "Customized for you", description: "We design and build custom for you. We can even start from a template unless you want that \"You don't fight?\"" },
              { icon: "💡", title: "Creative paying", description: "We're here when you need us and not on payroll when you don't." },
              { icon: "👥", title: "Expert turnovers", description: "You're getting 10+ years of design experience with every request. No hand-holding required." },
            ].map((item, index) => (
              <div key={index} className="flex flex-col">
                <div className="text-3xl text-[#99CF63] mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{index + 1}. {item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-black text-white py-16 px-4 md:px-8 rounded-3xl">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#99CF63] text-center mb-4">CLEAR & SIMPLE PRICING</p>
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">Simple pricing to level up your brand.</h2>
          <p className="text-center text-gray-400 mb-12">Senior experts. On-demand requests. Fast turnarounds. Flat monthly fee. Cancel anytime.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Standard",
                tag: "Most Popular",
                price: "$1,000/m",
                description: "One request at a time. For companies who need on-going marketing support.",
                features: [
                  "Create and manage a custom campaign",
                  "Support for basic campaign data analysis",
                  "Weekly summary reports"
                ]
              },
              {
                title: "Medium",
                tag: "Best value",
                price: "$2,000/m",
                description: "Double the requests. For companies with increasing design needs. Limited spots.",
                features: [
                  "All features in the small package",
                  "In-depth analytics (customer behavior, marketing effectiveness)",
                  "Detailed weekly reports"
                ]
              },
              {
                title: "Premium",
                price: "$3,500/m",
                description: "Perfect if you want to try the subscription out or only have a few one-off tasks.",
                features: [
                  "All features in the Medium package",
                  "User surveys and detailed analysis",
                  "Custom reports on key metrics"
                ]
              }
            ].map((plan, index) => (
              <div key={index} className="bg-gray-900 rounded-xl p-6 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold">{plan.title}</h3>
                  {plan.tag && <span className="bg-[#99CF63] text-black text-xs font-bold py-1 px-2 rounded">{plan.tag}</span>}
                </div>
                <p className="text-gray-400 mb-4">{plan.description}</p>
                <p className="text-4xl font-bold text-[#99CF63] mb-4">{plan.price}</p>
                <p className="text-sm text-gray-400 mb-6">Pause or cancel anytime</p>
                <ul className="mb-6 flex-grow">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start mb-2">
                      <span className="text-[#99CF63] mr-2">+</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className="bg-transparent border border-[#99CF63] text-[#99CF63] py-2 rounded-full mb-2 hover:bg-[#99CF63] hover:text-black transition duration-300">Book A Call</button>
                <button className="bg-[#99CF63] text-black py-2 rounded-full hover:bg-[#7ab84e] transition duration-300">Click to buy</button>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-gray-100 py-16 px-4 md:px-8 rounded-3xl mt-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            {[
              {
                question: "Why is Soliate important for my brand?",
                answer: "Digital marketing allows businesses to reach and engage with a wider audience, generate leads, drive website traffic, and increase brand visibility. It provides measurable results, allows for targeted marketing efforts, and enables businesses to adapt and optimize their strategies based on data and insights."
              },
              {
                question: "How can digital marketing help improve my website's visibility?",
                answer: "Digital marketing can improve your website's visibility through various strategies such as search engine optimization (SEO), content marketing, social media marketing, and paid advertising. These techniques help increase your website's ranking in search results, drive more traffic, and improve overall online presence."
              },
              {
                question: "How long does it take to see results from digital marketing efforts?",
                answer: "The timeline for seeing results from digital marketing efforts can vary depending on the strategies used and your specific goals. Some tactics, like paid advertising, can show immediate results, while others, such as SEO and content marketing, may take several months to show significant impact. Consistency and ongoing optimization are key to long-term success."
              },
              {
                question: "How do you measure the success of digital marketing campaigns?",
                answer: "We measure the success of digital marketing campaigns using various metrics and KPIs, including website traffic, conversion rates, engagement rates, click-through rates, return on investment (ROI), and more. We use analytics tools to track these metrics and provide regular reports to our clients, allowing for data-driven decision-making and strategy refinement."
              }
            ].map((faq, index) => (
              <div key={index} className="border-b border-gray-300 pb-6">
                <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start mb-12">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                Web3 Marketing & Automation Services to Boost Engagement & Growth
              </h2>
            </div>
            <div className="md:w-1/2">
              <p className="text-gray-600 mb-6">
                We are the top choice for brands embracing Web3. Our comprehensive toolkit automates campaigns, enhances engagement, and provides data-driven insights to optimize performance across platforms like X and beyond.
              </p>
              <button className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition duration-300">
                See more
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Auto-generating NFT/token",
                color: "bg-blue-500",
                buttonColor: "bg-black"
              },
              {
                title: "Blinks for users growth",
                color: "bg-red-500",
                buttonColor: "bg-white"
              },
              {
                title: "All data tracked via dashboard",
                color: "bg-purple-500",
                buttonColor: "bg-white"
              }
            ].map((service, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg flex flex-col justify-between">
                <div>
                  <div className={`w-4 h-4 ${service.color} rounded-full mb-4`}></div>
                  <h3 className="text-xl font-semibold mb-4">{service.title}</h3>
                </div>
                <button className={`${service.buttonColor} ${service.buttonColor === 'bg-white' ? 'text-black border border-black' : 'text-white'} px-4 py-2 rounded-full flex items-center justify-center`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-black text-white rounded-3xl p-12 flex justify-between items-center mt-12 shadow-2xl">
        <h2 className="text-5xl md:text-6xl font-bold">Ready to work with us ?</h2>
        <button className="bg-white text-black px-8 py-4 rounded-full font-semibold flex items-center text-lg hover:bg-gray-100 transition duration-300">
          Get Started
          <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </main>
  )
}