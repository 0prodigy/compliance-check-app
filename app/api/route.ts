import openai from "openai";
import { convert } from "html-to-text";

const {
  NEXT_PUBLIC_OPENAI_API_KEY,
  NEXT_PUBLIC_OPENAI_BASE_URL,
  NEXT_PUBLIC_MODEL,
} = process.env;

const compliancePolicy = `
'Treasury·HomeBanking as a serviceTreasuryTreasury and Issuing product marketing, design, and compliance guidelinesMarketing Treasury-based servicesCreate precise messaging for your users that complies with regulations.Many states have statutory prohibitions on references to “banking," “banks," and “bank accounts” when the entities making these references are not state- or federally-chartered banks or credit unions. Imprecise terminology of Stripe Treasury accounts might draw scrutiny from regulators.Recommended TermsFor your platform to efficiently leverage Stripe Treasury, you need to brand and communicate the nature of the product while being mindful of regulations. Refer to the following list of recommended terms to use in your messaging when building out your implementation of the product.Money management, or money management account or solutionCash management, or cash management account or solution[Your brand] accountFinancial servicesFinancial accountFinancial productFinancial service productStore of fundsWallet or open loop walletStored-value accountOpen-Loop stored-value accountPrepaid access accountEligible for FDIC “pass-through” insuranceFunds held at [Partner Bank], Member FDICTerms to AvoidAvoid the terms in this list for any marketing programs you create because only financial institutions licensed as banks can use them.Stripe or [Your Brand] bankBank accountBank balanceBankingBanking accountBanking productBanking platformDepositsMobile banking[Your Brand] pays interest[Your Brand] sets interest rates[Your Brand] advances fundsPhrases that suggest your users receive banking products or services directly from bank partners, for example:Create a [Bank Partner] bank accountA better way to bank with [Bank Partner]Mobile banking with [Bank Partner]Yield compliance marketing guidanceAs a platform, you can provide your customers with yield, calculated as a percentage of their Treasury balance. We understand that this can be a great value proposition as part of your product. When you market and disclose yield to your potential and existing customers, don’t conflate yield with interest. We’ve outlined best practices for your marketing disclosures below. If you have any questions on how to present yield in your marketing, contact our compliance team at platform-compliance@stripe.comRecommended Terms:Always refer to yield as “yield”.Always disclose prominently in your marketing materials that the yield percentage is subject to change and the conditions under which it might change.Notify your existing customers whenever the yield percentage has changed. Prominently display the most recent yield percentage in their dashboard.Terms to avoidNever refer to yield as “interest”.Don’t reference the Fed Funds Rate as a benchmark for setting your yield percentage.Don’t imply that the yield is pass-through interest from a bank partner.How to talk about FDIC insurance eligibilityStripe Treasury balances are stored value accounts that are held “for the benefit of” our Stripe Treasury users with our bank partners, Evolve Bank & Trust and Goldman Sachs Bank USA. We disclose to you which of our partners hold your funds. For FDIC insurance to apply to a user’s balance in a “for the benefit of” account, we must satisfy the rules for FDIC pass-through deposit insurance, unlike a bank account directly with an FDIC insured bank.We understand that FDIC insurance eligibility can be a valuable feature to your customers. Stripe has approved the variations of the phrase “FDIC Insurance eligible” noted below on marketing materials, as long as certain conditions are met.  Specifically, the statement of FDIC insurance eligibility must always be paired with two disclosures:Stripe Treasury Accounts are eligible for FDIC pass-through deposit insurance if they meet certain requirements. The accounts are eligible only to the extent pass-through insurance is permitted by the rules and regulations of the FDIC, and if the requirements for pass-through insurance are satisfied.  The FDIC insurance applies up to 250,000 USD per depositor, per financial institution, for deposits held in the same type of account (business versus personal, and so on).You must also disclose that neither Stripe nor you are an FDIC insured institution and that the FDIC’s deposit insurance coverage only protects against the failure of an FDIC insured depository institution.The following terms that incorporate the term “eligible” are approved:Don’t use the following terms:“Eligible for FDIC insurance”“FDIC insurance-eligible accounts”“Eligible for FDIC pass-through insurance”“Eligible for FDIC insurance up to the standard maximum deposit insurance per depositor in the same capacity"“Eligible for FDIC insurance up to $250K”“FDIC insured”“FDIC insured accounts”“FDIC pass-through insurance guaranteed”We have also prepared these FAQs that you can use when your customers have questions about FDIC insurance eligibility or any of the disclosures:Is FDIC insurance impacted if a customer holds deposits in other accounts with the same institution?It can be. It’s your responsibility to know which insured institutions hold your funds. If you have other business-purpose accounts with the same institution where Treasury funds are held, the FDIC might aggregate all of your business account balances with that institution in applying the 250,000 USD limit. The FDIC generally would not, however, aggregate your personal accounts with your business accounts.Does FDIC insurance eligibility protect from fraud or financial loss?No, FDIC insurance eligibility is applicable only in the event of a bank failure.How do I know if the requirements for FDIC pass-through insurance are met?Stripe Treasury accounts are designed to be eligible for FDIC pass-through insurance.  The FDIC makes the final determination about the availability of pass-through insurance at the time of a bank’s failure.Was this page helpful?YesNoNeed help? Contact Support.Watch our developer tutorials.Check out our product changelog.Questions? Contact Sales.Powered by MarkdocSign up for developer updates:Sign upYou can unsubscribe at any time. Read our privacy policy.On this pageRecommended TermsTerms to AvoidYield compliance marketing guidanceProducts UsedTreasury'
`;

const client = new openai.OpenAI({
  apiKey: NEXT_PUBLIC_OPENAI_API_KEY,
  baseURL: NEXT_PUBLIC_OPENAI_BASE_URL,
});

const extractTextFromHTML = (htmlContent: string) => {
  // get substring between <body> and </body>
  const bodyContent = htmlContent.match(/<body[^>]*>([\s\S]*)<\/body>/);
  if (!bodyContent) {
    throw new Error("No body content found");
  }
  const textContent = convert(bodyContent[1], {
    wordwrap: false,
  });
  return textContent.trim();
};

const checkCompliance = async (webpageContent: string) => {
  const textContent = extractTextFromHTML(webpageContent);

  // Use OpenAI to compare text content against compliance policy
  const prompt = `Check the following text content against the compliance policy:\n\n${textContent}\n\n and report to violation with mentioning the policy in points only (keep the word count in mind).\n\nCompliance Policy:\n${compliancePolicy} \n\nViolation Points:`;

  const response = await client.chat.completions.create({
    model: NEXT_PUBLIC_MODEL || "",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.5,
    max_tokens: 300,
  });

  return response.choices[0].message;
};

export async function POST(req: Request) {
  try {
    // Get webpage URL from the request body
    const { url } = await req.json();

    // Fetch webpage content
    const webpageContent = await fetch(url).then((res) => res.text());

    // Check compliance
    const findings = await checkCompliance(webpageContent);

    return new Response(JSON.stringify(findings), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}
