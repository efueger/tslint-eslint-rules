import * as ts from "tslint/node_modules/typescript";
import * as Lint from "tslint/lib/lint";

export class Rule extends Lint.Rules.AbstractRule {
  public static FAILURE_STRING = 'Duplicate case label: ';

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    const walker = new NoDuplicateCaseWalker(sourceFile, this.getOptions());
    return this.applyWithWalker(walker);
  }
}

class NoDuplicateCaseWalker extends Lint.RuleWalker {
  protected visitSwitchStatement(node: ts.SwitchStatement) {
    this.validateNoDupeCase(node);    
    super.visitSwitchStatement(node);
  }
  
  private validateNoDupeCase(node: ts.SwitchStatement) {
    const mapping = {};
    let defaultCases = 0;
    
    node.caseBlock.clauses.forEach((clause) => {
      if (clause.kind == ts.SyntaxKind.CaseClause) {
        const key = clause.getText();
        if (mapping[key]) {
          this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
        }
        else {
          mapping[key] = clause;
        }
      }
    });
  }
}
