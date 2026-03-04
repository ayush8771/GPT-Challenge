# Sample Legal Document for Testing

If you don't have a legal document ready, you can use this sample contract to test the application:

---

## SAMPLE EMPLOYMENT AGREEMENT

**This Employment Agreement** ("Agreement") is entered into as of January 1, 2024, by and between TechCorp Industries Inc. ("Employer") and John Doe ("Employee").

### 1. POSITION AND DUTIES

Employee is hired as a Software Engineer and agrees to perform duties assigned by Employer. Employee will devote full business time and attention to the performance of such duties.

### 2. COMPENSATION

Employer agrees to pay Employee a base salary of $85,000 per year, payable in accordance with Employer's standard payroll practices. Employee will be eligible for annual performance bonuses at the sole discretion of Employer.

### 3. BENEFITS

Employee will be eligible for health insurance, dental insurance, and retirement benefits in accordance with Employer's standard policies, subject to waiting periods and eligibility requirements.

### 4. TERMINATION

**4.1 At-Will Employment**: This is an at-will employment relationship. Either party may terminate this Agreement at any time, with or without cause, and with or without notice.

**4.2 Immediate Termination**: Employer reserves the right to terminate Employee immediately for cause, including but not limited to: misconduct, violation of company policies, poor performance, or any action that damages Employer's reputation or business interests.

**4.3 No Severance**: In the event of termination, Employee acknowledges that they are not entitled to any severance pay or benefits beyond accrued but unpaid wages through the date of termination.

### 5. CONFIDENTIALITY AND NON-DISCLOSURE

**5.1 Confidential Information**: Employee agrees to maintain strict confidentiality of all proprietary information, trade secrets, client lists, business strategies, and any other confidential information of Employer ("Confidential Information").

**5.2 Return of Materials**: Upon termination, Employee must immediately return all company property, documents, and Confidential Information.

**5.3 Perpetual Obligation**: This confidentiality obligation survives termination of employment and continues indefinitely.

### 6. NON-COMPETE AND NON-SOLICITATION

**6.1 Non-Compete**: For a period of three (3) years following termination of employment for any reason, Employee agrees not to work for, consult with, or provide services to any company that competes with Employer within a 500-mile radius of Employer's offices.

**6.2 Non-Solicitation**: Employee agrees not to solicit, recruit, or hire any employees of Employer for a period of five (5) years following termination.

**6.3 Client Non-Solicitation**: Employee agrees not to contact, solicit business from, or provide services to any client or customer of Employer for a period of five (5) years following termination.

### 7. INTELLECTUAL PROPERTY

**7.1 Work Product**: All inventions, discoveries, works of authorship, trade secrets, and other intellectual property created by Employee during employment, whether during work hours or not, and whether using company resources or not, shall be the exclusive property of Employer.

**7.2 Prior Inventions**: Employee represents that they have disclosed all prior inventions and agrees to execute any documents necessary to transfer ownership of all work product to Employer.

**7.3 Moral Rights**: Employee waives all moral rights in any work product.

### 8. INDEMNIFICATION

Employee agrees to indemnify and hold harmless Employer from any claims, damages, losses, or expenses arising from Employee's breach of this Agreement or Employee's negligence or willful misconduct.

### 9. DISPUTE RESOLUTION

**9.1 Arbitration**: Any dispute arising under this Agreement shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association. The decision of the arbitrator shall be final and binding.

**9.2 Costs**: Employee shall bear all costs of arbitration, including Employer's attorney fees, if Employer prevails.

**9.3 Waiver of Rights**: Employee hereby waives the right to bring any class action or to seek a jury trial.

### 10. CHANGES TO AGREEMENT

Employer reserves the right to modify the terms of this Agreement at any time, with or without notice to Employee. Continued employment after such modifications constitutes acceptance of the new terms.

### 11. ENTIRE AGREEMENT

This Agreement constitutes the entire agreement between the parties and supersedes all prior discussions, negotiations, and agreements.

### 12. GOVERNING LAW

This Agreement shall be governed by the laws of the State of Delaware, without regard to conflict of law principles.

---

**EMPLOYEE SIGNATURE**: _________________________ DATE: _____________

**EMPLOYER SIGNATURE**: _________________________ DATE: _____________

---

## Notes for Testing

This sample contract intentionally includes several problematic clauses that the analyzer should flag as red flags:

1. **Termination without notice or cause** (High Risk)
2. **No severance pay** (Medium Risk)
3. **3-year non-compete with 500-mile radius** (High Risk - likely unenforceable)
4. **5-year non-solicitation** (High Risk - unreasonably long)
5. **Indefinite confidentiality** (Medium Risk)
6. **Broad intellectual property assignment** (High Risk)
7. **Employee pays arbitration costs** (High Risk)
8. **Unilateral modification rights** (High Risk)
9. **Waiver of class action and jury trial** (High Risk)

The analyzer should identify these issues and provide explanations for why they are concerning.
