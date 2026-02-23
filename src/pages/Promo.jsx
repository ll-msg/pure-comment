import { Layout, Button } from 'antd';
import Typewriter from "typewriter-effect";
import { FaShieldCat } from "react-icons/fa6";
import Card, { HeaderButton, SectionTitle } from "./Card";
import Contact from './Contact';
import AnimatedBg from './AnimatedBg';
import './Promo.css'

const { Header, Content, Footer } = Layout;

export default function Promo() {

    return (
    <Layout className="promoLayout">
        <AnimatedBg />
        <Header className="sticky top-0 z-50 flex items-center justify-between bg-black text-white border-b border-white/10 font-heading">
            <a href=""  className="flex items-center gap-2 text-xl text-white no-underline hover:text-white">
                <FaShieldCat />
                Pure Comment
            </a>
            <div className='flex items-center gap-6 text-white'>
                <HeaderButton description="How It Works" target="how-it-works" />
                <HeaderButton description="Features" target="features"  />
                <HeaderButton description="Future" target="future"  />
                <HeaderButton description="Contact Us" target="contact-us"  />
            </div>
        </Header>

        <Content>
            {/* Titles */}
            <section className="mx-auto max-w-6xl px-6 py-24 text-center">
                <div className="py-24 text-center">
                    <h1 className="text-7xl font-semibold tracking-tight text-white font-heading">
                        <Typewriter
                            onInit={(typewriter) => {
                                typewriter.typeString("AI-driven Comment Filter,").start();
                            }}
                            options={{
                                delay: 60,
                                cursor: "",
                            }}
                        />
                    </h1>
                    <p className="mt-2 text-6xl text-white italic font-script">
                        effortlessly.
                    </p>
                    <p className="mt-2 text-lg text-white/50 mt-5 font-semibold">
                        Every comment you see, clearer, smarter, and under your control.
                    </p>
                    <Button color="primary" variant="solid" className='mt-8 font-semibold' 
                        onClick={() => document.getElementById("contact-us")?.scrollIntoView({
                            behavior: "smooth"
                        })}
                    >
                        Try It Now
                    </Button>
                    <p className="mt-2 text-xs text-white/50 font-heading mt-5">
                        Chrome Dev/Canaray version 128 or later required
                    </p>
                </div>
            </section>

            {/* How it works */}
            <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-24">
                <SectionTitle title="How it works" description="Get started in seconds with a simple workflow."/>
                <div className="grid gap-6 md:grid-cols-3">
                    <Card step="01" title="Install extension" description="Add PureComment to your Chrome."/>
                    <Card step="02" title="Browse SNS normally" description="AI organizes discussions automatically."/>
                    <Card step="03" title="Enjoy pure journey" description="Now focus on meaningful conversations."/>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="mx-auto max-w-6xl px-6 py-24">
                <SectionTitle title="Features" description="Explore more with your own hands."/>
                <div className="grid gap-6 md:grid-cols-3">
                    <Card step="01" title="AI-driven (Nano Prompt API) Comment Filtering" description="Automatically detects and filters out toxic or irrelevant comments by blurring them."/>
                    <Card step="02" title="Adjustable Sensitivity" description="Adjust the detection level (Low → High) to control how strictly comments are filtered."/>
                    <Card step="03" title="Keyword Blocklist" description="Add your own custom blocked words to hide specific terms or phrases."/>
                </div>
            </section>

            {/* Contact us */}
            <Contact id="contact-us" />

        </Content>

        <Footer className="bg-black text-white border-t border-white/10 text-center">
            Made by Yanran Wang, Xinyue Zhang
        </Footer>
    </Layout>
  )
}