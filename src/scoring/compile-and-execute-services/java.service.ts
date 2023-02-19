import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import * as cp from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class JavaService {
  constructor(
    @Inject('SCORING_PATH')
    private scoringPath: string,
  ) {}

  compileAndExecute(
    code: string,
    testCases: {
      input: string;
      output: string;
    }[],
  ): [any, any] {
    return [null, null];
  }

  compile(code: string) {
    let compileErr = null;
    const id = randomUUID();
    fs.writeFileSync(path.resolve(this.scoringPath + `/${id}.java`), code);
    try {
      cp.execSync(`javac ${path.resolve(this.scoringPath + `/${id}.java`)}`);
    } catch (err) {
      compileErr = err.message;
    }
    fs.unlinkSync(path.resolve(this.scoringPath + `/${id}.java`));
    return [id, compileErr];
  }

  execute(
    id: string,
    testCases: {
      input: string;
      output: string;
    }[],
  ): [any, any] {
    let passedTestCases = 0;
    let totalTime = 0;
    try {
      for (const testCase of testCases) {
        const t1 = performance.now();
        const result = cp.execSync(
          `java ${path.resolve(this.scoringPath + `/${id}`)}`,
          { input: testCase.input },
        );
        const t2 = performance.now();
        const dt = t2 - t1;
        if (result.toString() == testCase.output) {
          passedTestCases++;
        }
        totalTime += dt;
      }
    } catch (err) {
      return [null, err.message];
    }

    console.log(`Passed test cases: ${passedTestCases}/${testCases.length}`);
    console.log(`Execution time: ${totalTime}ms`);

    if (fs.existsSync(path.resolve(this.scoringPath + `/${id}`))) {
      fs.unlinkSync(path.resolve(this.scoringPath + `/${id}`));
    }
    if (fs.existsSync(path.resolve(this.scoringPath + `/${id}.exe`))) {
      fs.unlinkSync(path.resolve(this.scoringPath + `/${id}.exe`));
    }

    return [{ passed: passedTestCases, execTime: totalTime }, null];
  }
}
