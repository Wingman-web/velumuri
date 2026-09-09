'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PageBanner } from '@/components/page-banner';

type TabId = 'cookie' | 'disclaimer' | 'whistleblower';

const TABS: { id: TabId; label: string }[] = [
  { id: 'cookie', label: 'Cookie Policy' },
  { id: 'disclaimer', label: 'Disclaimer' },
  { id: 'whistleblower', label: 'Whistle Blower Policy' },
];

export function PrivacyPolicyPage() {
  const [active, setActive] = useState<TabId>('cookie');
  const root = useRef<HTMLDivElement>(null);

  // .hero-line-inner (the PageBanner heading's masked line) starts
  // translateY(110%) — i.e. invisible — as soon as <html> has a `.js`
  // class (animations-v4.css, a progressive-enhancement rule: hidden
  // only once JS is confirmed present, so it never breaks with JS off).
  // Every other page that uses PageBanner adds that class and then
  // immediately tweens the line back to y:0 itself (about-page.tsx,
  // nri-page.tsx) — this page needs the same pair, or the heading stays
  // permanently hidden behind its own mask (worse still if a visitor
  // arrives here via a client-side nav from one of those pages: `.js`
  // is already stuck on <html> from the last page, so it's hidden from
  // the very first render, not just "not yet animated in").
  useLayoutEffect(() => {
    if (!root.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.documentElement.classList.add('js');
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.from('.page-banner-content .eyebrow', { y: 16, opacity: 0, duration: .8, scrollTrigger: { trigger: '.page-banner', start: 'top 90%', once: true } });
      gsap.to('.page-banner-content h1 .hero-line-inner', { y: 0, duration: 1, stagger: .12, scrollTrigger: { trigger: '.page-banner', start: 'top 90%', once: true } });
    }, root);
    return () => context.revert();
  }, []);

  return (
    <div ref={root}>
      <PageBanner eyebrow="Legal" lines={['Privacy &', 'Our Policies.']} image="hero/banner-dusk.png" alt="Velumuri Vistas at dusk" />

      <section className="legal-section" aria-label="Policy documents">
        <div className="container legal-layout">
          <div className="legal-tablist" role="tablist" aria-label="Policy sections" aria-orientation="vertical">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`legal-tab${active === tab.id ? ' is-active' : ''}`}
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={active === tab.id}
                aria-controls={`panel-${tab.id}`}
                tabIndex={active === tab.id ? 0 : -1}
                onClick={() => setActive(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="legal-content">
            {/* ---------------- COOKIE POLICY ---------------- */}
            <div className="legal-panel" role="tabpanel" id="panel-cookie" aria-labelledby="tab-cookie" hidden={active !== 'cookie'}>
              <h2>Cookie Policy</h2>
              <p className="legal-lead">Cookie Notices and Consent Explained</p>

              <p>Cookies are an important element in the functioning of websites. Most of the customization and social media integration on websites rely on cookies, in one way or the other.</p>
              <p>Nevertheless, they can be used in a way that doesn&rsquo;t benefit you. They are often used to track people across the web and build up similar looking profiles that are very valuable to brands and advertisers for targeted marketing.</p>
              <p>This is, most often than not, seen as an invasion of privacy, and because cookies work in the background you might not realize its activities or be able to stop it if you wanted to. To avoid the occurrence of this, there is a privacy policy in place.</p>
              <p>It requires websites to give you clear, detailed information about how they use cookies, and provide ways for you to signal whether or not you want to allow such use. The website is then required by law to respect your wishes. This might mean they block the cookies you don&rsquo;t like, or they don&rsquo;t let you access their site.</p>
              <p>Some websites will allow you to choose which types of cookies to allow or block, although in some cases, if you do this you may not be able to use or see all of a website.</p>

              <h3>What Are Cookies?</h3>
              <p>Cookies are pieces of data (files of letters and numbers) that we store on your browser or the hard drive of your computer if you agree. Cookies contain information that is transferred to your computer&rsquo;s hard drive.</p>
              <p>They were created to overcome a limitation in web technology. Web pages have no memory, and cannot easily pass information between each other. So cookies provide a kind of memory for web pages.</p>
              <p>Cookies allow you to log in on one page, then move around to other pages and stay logged in. They allow you to set preferences for the display of a page, and for these to be remembered the next time you return to it.</p>
              <p>Cookies can also be used to watch the pages you visit between sites, which allows advertisers to build up a picture of your interests. Then when you land on a site that shows one of their adverts, they can tailor it to those interests. This is known as &lsquo;behavioural advertising&rsquo;.</p>

              <h3>How Cookies Work</h3>
              <p>We use cookies that are required for the operation of our sites (they include, for example, cookies that enable you to log into the secure area of our sites). Further, they are used for the following reasons:</p>
              <ul>
                <li>Allow us to recognize and count the number of visitors.</li>
                <li>See how visitors move around our sites when they are using it.</li>
                <li>Recognize you when you return to our sites in order to enable us to personalize our content for you.</li>
                <li>Record your visit to our sites, the pages you have visited and the links you have followed in order to make our sites more relevant to your interests.</li>
              </ul>
              <p><em>Please note: Third parties may also use cookies, over which we have no control.</em></p>

              <h3>Know Your Rights</h3>
              <ol type="A">
                <li>You have the right to ask us not to process your personal data for marketing purposes.</li>
                <li>You can block cookies by activating the setting on your browser that allows you to refuse all or some cookies. However, if you use your browser settings to block all cookies (including essential cookies) you may not be able to access all or parts of our site.</li>
                <li>Our sites may contain links to and from the websites of our partner networks, advertisers and affiliates. If you follow a link, please note that these websites have their own privacy policies. We do not accept any responsibility or liability for these policies. Please check these policies before you submit any personal data to these websites.</li>
              </ol>
            </div>

            {/* ---------------- DISCLAIMER ---------------- */}
            <div className="legal-panel" role="tabpanel" id="panel-disclaimer" aria-labelledby="tab-disclaimer" hidden={active !== 'disclaimer'}>
              <h2>Disclaimer</h2>
              <p>Any person logging on to or using this site (&ldquo;the Visitor&rdquo;) has unconditionally accepted the terms and conditions of use, and these constitute a binding and enforceable agreement between the Visitor and Velumuri Infra Builders &amp; Developers Private Limited (&ldquo;the Company&rdquo;) or the Velumuri Infra group.</p>
              <ol>
                <li>The information on this website is presented as general information and no representation or warranty is expressly or impliedly given as to its accuracy, completeness or correctness.</li>
                <li>The visitor is presumed to have read the terms and conditions of the website and is deemed to have agreed, understood and accepted unconditionally all the terms, conditions, procedures and risks of logging onto the website, and cannot claim, at any time, ignorance of any or all of them. All relationships of any visitor of this website, wheresoever situated, are governed by and in accordance with the laws and jurisdiction of Hyderabad, India.</li>
                <li>The Company uses all diligence, skill and expertise available to provide information on this website but does not accept or undertake any express or implied warranty of any nature whatsoever, and disclaims all or any errors and mistakes to the fullest extent. The Company does not warrant that the information offered will be error-free, that defects will be corrected, or that this site or the server that makes it available are or will be free of viruses or other harmful components. The Company shall not be under any obligation to ensure compliance or handle complaints.</li>
                <li>This website may unintentionally include inaccuracies or errors with respect to the description of a plot/flat size, site plan, floor plan, a rendering, a photo, the elevation, prices, taxes, adjacent properties, amenities, design guidelines, completion dates, features, zoning, buyer incentives, etc. Square footage and room sizes are approximate and may vary.</li>
                <li>The plans, specifications, images and other details herein are only indicative, and the Company reserves the right to change any or all of these in the interest of the project/development. The website does not constitute an offer and/or contract of any nature whatsoever. Any purchase/leave-and-license in any project shall be governed by the terms of the agreement entered into between the parties, and no details mentioned on this website shall govern the transaction. The Company and its respective subsidiaries and affiliates, and their respective officers, directors, partners, employees, agents, managers, trustees, representatives or contractors, and any successors or assigns of any of the foregoing, shall not be liable for any direct, indirect, actual, punitive, incidental, special or consequential damages or economic loss whatsoever, arising from or related to the use of or reliance on this website. The Company reserves the right to alter, amend and vary the layout, plans and specifications or features without prior notice or obligation, but subject to the approval of the competent authorities as applicable.</li>
                <li>The visitor, by the act of logging onto the website and/or submitting information or giving their name, address, or email address as identification to the Company through the website, phone, fax or e-mail, is deemed to have consented and expressly and irrevocably authorized the Company to use, reveal, analyze or display and transmit all information and documents as may be required by it. The visitor represents and warrants that they have provided true, accurate, current and complete information about themselves, and if any information is found to be untrue, inaccurate, not current or incomplete, the Company has the right to take any action it deems appropriate without any limitation.</li>
                <li>The visitor represents and warrants that they are fully aware of the laws of the country/state they reside in, and also those of India, particularly those governing the use, sale, lease and transfer of real estate, and that the visitor is neither violating nor attempting to violate any law.</li>
                <li>The contents, information and material contained in this website are the exclusive property of the Company and are protected by copyright and intellectual property laws. No person shall use, copy, reproduce, distribute, initiate, publish, display, modify, create derivative works or a database, transmit, upload, exploit, sell or distribute the same in whole or in part without prior express written permission from the Company. The facility to print an article or portion of text or material on this website through a computer/electronic device does not amount to prior written consent.</li>
                <li>Notwithstanding anything stated above or elsewhere on this website, it is clarified, understood and agreed that the Company, through this website, does not intend to make any offer, proposal or contract as per prevailing laws in India or any similar or relevant law in the country of residence or access of the visitor. The Company has the right to reproduce, monitor and disclose any transmission or information received and made to this website. Visitors may be contacted through the email addresses, phone numbers and postal addresses provided by them on the website; any visitor who does not desire to receive communication from the Company may give clear instructions to that effect.</li>
                <li>The visitor shall not use or post any computer programs in connection with their use of the website that contain destructive features, such as viruses, anomalies, self-destruct mechanisms, time/logic bombs, worms or Trojan horses.</li>
                <li>Notwithstanding anything herein, in no event shall the Company, its promoters, directors, employees and agents be liable to the visitor for any or all damages, losses and causes of action (including but not limited to negligence), errors or injury, whether direct, indirect, consequential or incidental, suffered or incurred by any person(s) due to any use and/or inability to use this site or its information, links or hyperlinks, or any action taken or abstained, or any transmission made through this website.</li>
                <li>Any links to off-site pages or other sites may be accessed by the visitor at their own option and risk, and the Company assumes no liability for and shall be held harmless from any resulting damages. The Company strongly recommends that the visitor carefully reads the terms and conditions of such linked site(s).</li>
                <li>The Company reserves the right to terminate, revoke, modify, alter, add to, and delete any one or more of the terms and conditions of the website. The Company shall be under no obligation to notify the visitor of amendments to the terms and conditions, and the visitor shall be bound by such amended terms and conditions.</li>
              </ol>
            </div>

            {/* ---------------- WHISTLE BLOWER POLICY ---------------- */}
            <div className="legal-panel" role="tabpanel" id="panel-whistleblower" aria-labelledby="tab-whistleblower" hidden={active !== 'whistleblower'}>
              <h2>Whistle Blower Policy</h2>
              <p className="legal-lead">Velumuri Infra Builders &amp; Developers Private Limited</p>

              <h3>1. Preface</h3>
              <p>Velumuri Infra Builders &amp; Developers Private Limited (&ldquo;the Company&rdquo;), being a company incorporated under the Companies Act, 1956 and governed by the Companies Act, 2013, requires a vigil mechanism for directors and employees to report genuine concerns as per Section 177 of the Companies Act, 2013 read with Rule 7 of the Companies (Meeting of Board and its Powers) Rules, 2014.</p>
              <p>These provisions require companies covered by them to devise an effective whistle blower mechanism for directors and employees to report concerns about unethical behaviour, actual or suspected fraud, or violation of the Company&rsquo;s code of conduct or ethics policy.</p>
              <p>In view of the above, the Company proposes to establish a Vigil Mechanism and to formulate this Vigil Mechanism/Whistle Blower Policy.</p>

              <h3>2. Objective Of The Policy</h3>
              <p>The purpose of this Policy is to provide a framework to promote responsible and secure vigil mechanism/whistle blowing. It protects employees wishing to raise a concern about serious irregularities within the Company and provides a platform for grievance redressal.</p>
              <p>The Company encourages its directors and employees who have genuine concerns about suspected misconduct to come forward and express these concerns without fear of punishment or unfair treatment.</p>
              <p>A vigil (whistle blower) mechanism provides a channel to employees and directors to report to the management any concerns about unethical behaviour, actual or suspected fraud, or violation of the Company&rsquo;s codes of conduct or policy, with adequate safeguards against victimisation and direct access to the Vigilance Officer appointed for this purpose.</p>
              <p>This policy neither releases employees from their duty of confidentiality in the course of their work, nor can it be used as a route for raising malicious or unfounded allegations against people in authority and/or colleagues in general.</p>

              <h3>3. Scope Of The Policy</h3>
              <p>This Policy covers malpractices and events which have taken place or are suspected to have taken place &mdash; misuse or abuse of authority, fraud or suspected fraud, violation of Company rules, manipulation, negligence causing danger to public health and safety, misappropriation of monies, and other matters affecting the interest of the Company that are formally reported by whistle blowers. This Policy is intended to encourage and enable employees to raise serious concerns within the Company prior to seeking resolution outside it.</p>

              <h3>4. Definitions</h3>
              <ul className="legal-def-list">
                <li><strong>Board</strong> &mdash; means the Board of Directors of the Company.</li>
                <li><strong>Company</strong> &mdash; means Velumuri Infra Builders &amp; Developers Private Limited and all its offices pan-India.</li>
                <li><strong>Code</strong> &mdash; means the Code of Conduct for Directors and Senior Management adopted by the Company.</li>
                <li><strong>Employee</strong> &mdash; means all present employees and directors of the Company, whether working in India or abroad.</li>
                <li><strong>Protected Disclosure</strong> &mdash; means any communication in good faith that discloses or demonstrates information that may evidence unethical or improper activity.</li>
                <li><strong>Subject</strong> &mdash; means a person or group of persons against or in relation to whom a Protected Disclosure is made or evidence gathered during an investigation.</li>
                <li><strong>Vigilance and Ethics Officer</strong> &mdash; means an officer appointed to receive protected disclosures from whistle blowers, maintain records thereof, take appropriate steps for disposal, and inform the whistle blower of the result.</li>
                <li><strong>Whistle Blower</strong> &mdash; is an employee or group of employees who make a Protected Disclosure under this Policy, also referred to as the complainant.</li>
              </ul>

              <h3>5. Reporting Of Protected Disclosures</h3>
              <p>All employees of the Company are eligible to make protected disclosures under this Policy in relation to matters concerning the Company. The Company does not tolerate any malpractice, impropriety, statutory non-compliance or wrongdoing, and this Policy empowers employees to pro-actively bring such instances to light without fear of reprisal, discrimination or adverse employment consequences.</p>
              <p>This Policy is not intended to question financial or business decisions taken by the Company that are not Protected Disclosures, nor should it be used to reconsider matters already addressed through disciplinary or other internal procedures. This policy shall not be used for:</p>
              <ul>
                <li>Raising grievances related to an employee&rsquo;s own career or other personal grievances.</li>
                <li>Raising grievances related to the career of other employees or colleagues.</li>
                <li>Grievances arising out of Company policies/procedures or management decisions in that respect.</li>
                <li>Grievances related to similar issues as the above.</li>
              </ul>
              <p>All Protected Disclosures should be reported in writing by the Whistle Blower as soon as possible after becoming aware of the matter, to ensure a clear understanding of the issues raised. Employees can lodge a Protected Disclosure by:</p>
              <ul>
                <li>Sending an email to <a href="mailto:dsprasad@velumuriinfra.com">dsprasad@velumuriinfra.com</a> with the subject &ldquo;Protected Disclosure under the Whistle Blower Policy&rdquo;.</li>
                <li>Sending a letter in a closed, secured envelope superscribed &ldquo;Protected Disclosure under the Whistle Blower Policy&rdquo; to the Vigilance and Ethics Officer, typed or written legibly in English.</li>
              </ul>
              <p>The contact details of the Vigilance and Ethics Officer are:</p>
              <p className="legal-contact-block">
                Sri D. Someswara Prasad<br />
                Email: <a href="mailto:dsprasad@velumuriinfra.com">dsprasad@velumuriinfra.com</a><br />
                Address: 802, Astral Heights, Road No. 1, Banjara Hills, Hyderabad &ndash; 500034
              </p>
              <p>To protect the complainant&rsquo;s identity, the Vigilance and Ethics Officer will not issue any acknowledgement, and complainants are advised not to write their name/address on the envelope. Anonymous or pseudonymous disclosures shall not be entertained. Misuse of this Policy by making frivolous or bogus complaints with malafide intent is strictly prohibited and subject to disciplinary action.</p>
              <p>A Whistle Blower&rsquo;s role is that of a reporting party; they are not investigators or finders of fact, nor can they determine the appropriate corrective or remedial action. To the extent possible, a complaint should include: the parties involved; where and when it happened; the type of concern (financial reporting, legal matter, management action, employee misconduct, health &amp; safety, etc.); any available proof; who to contact for more information; and prior efforts to address the problem.</p>

              <h3>6. Receipt, Investigation And Disposal Of Protected Disclosures</h3>
              <p>On receipt of a Protected Disclosure, the Vigilance and Ethics Officer shall record it, ascertain the complainant, and carry out an initial investigation before referring the matter to the Board of Directors for further investigation and action. The record will include brief facts, whether the matter was raised previously, actions taken, and findings/recommendations.</p>
              <p><strong>Investigation:</strong> An investigation is a neutral fact-finding process, not an accusation. Subjects will normally be informed in writing of the allegations and given an opportunity to respond. They must cooperate with the investigation and shall not withhold, destroy or tamper with evidence, or influence, coach, threaten or intimidate witnesses &mdash; failing which they are subject to strict disciplinary action, up to dismissal. Subjects have a right to consult a person of their choice (other than the investigators or the Whistle Blower), to be informed of the outcome, and, unless there are compelling reasons otherwise, to respond to material findings. No allegation shall be considered maintainable without good supporting evidence. Investigations are normally completed within 90 days of receipt, extendable at the Vigilance and Ethics Officer&rsquo;s discretion. All information disclosed during the investigation remains confidential except as necessary to conduct it or take remedial action.</p>
              <p><strong>Disposal:</strong> If an investigation concludes that an improper or unethical act was committed, the Vigilance and Ethics Officer shall take, or recommend, disciplinary or corrective action commensurate with the offence, and the Company may take further measures to prevent similar violations. Any disciplinary action shall adhere to the Company&rsquo;s applicable conduct and disciplinary procedures. The Vigilance and Ethics Officer shall report to the Board as required. A complainant who makes false allegations shall be subject to appropriate disciplinary action.</p>

              <h3>7. Protection</h3>
              <p>No employee who, in good faith, makes a disclosure under this Policy shall suffer reprisal, discrimination or adverse employment consequences. The Company prohibits discrimination, retaliation or harassment of any kind against a Whistle Blower, and any employee who retaliates will be subject to strict disciplinary action, up to and including termination.</p>
              <p>An employee who believes they are being subjected to discrimination, retaliation or harassment for making a report under this Policy should immediately report those facts to their supervisor, manager, or the Vigilance and Ethics Officer. The Company will take steps to minimise difficulties for the Whistle Blower, and their identity shall be kept confidential to the extent possible and permitted by law &mdash; the same protection extends to any employee assisting in the investigation.</p>

              <h3>8. Retention Of Documents</h3>
              <p>The Company shall maintain documentation of all Protected Disclosures or reports under this Policy, including written submissions, relevant Company documents, a summary of how and when the complaint was received, and the Company&rsquo;s response. Such documentation shall be retained for a minimum of five (5) years, or such longer period as required by law, from the date of receipt of the complaint, with confidentiality maintained to the extent reasonably practicable.</p>

              <h3>9. Amendment To This Policy</h3>
              <p>The Company reserves the right to amend or modify this Policy in whole or in part at any time, without assigning any reason, in order to maintain compliance with applicable regulations or accommodate organisational changes. No such amendment shall be binding on employees and directors unless notified to them in writing.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
