# GaitWise-Web

모바일 프로젝트 - GaitWise Web

아래는 개발 중 사용할 수 있는 주요 npm 스크립트에 대한 설명입니다.

## 프로젝트 설치 및 실행 방법

### 설치 방법

다음 명령어로 프로젝트의 의존성을 설치할 수 있습니다.

```bash
npm install
```

### 1. 개발 서버 실행

개발 환경에서 애플리케이션을 실행하려면 다음 명령어를 사용합니다.  
애플리케이션은 [http://localhost:3000](http://localhost:3000) 에서 실행됩니다.

```bash
npm run dev
```

### 2. 프로덕션 빌드

애플리케이션을 배포하기 전에 프로덕션 모드로 빌드를 생성하려면 다음 명령어를 사용합니다.

```bash
npm run build
```

### 3. 프로덕션 서버 실행

프로덕션 모드에서 애플리케이션을 실행하려면 다음 명령어를 사용합니다.

```bash
npm start
```

## 코드 품질 관리

### 4. ESLint를 사용한 코드 검사

프로젝트 코드에서 Lint 오류를 검사하려면 다음 명령어를 사용합니다.

```bash
npm run lint
```

- **명령어**: `npm run lint`
- **설명**: Next.js 내장 Lint 도구를 사용하여 프로젝트 전반의 Lint 오류를 검사합니다.

### 5. ESLint를 사용한 자동 코드 수정

Lint 오류를 자동으로 수정하려면 다음 명령어를 사용합니다.

```bash
npm run lint-fix
```

- **명령어**: `npm run lint-fix`
- **설명**: `eslint . --fix` 명령어를 사용하여 가능한 모든 Lint 오류를 자동으로 수정합니다.

---

## 사용된 주요 라이브러리 및 도구

- **Next.js**: 서버 사이드 렌더링(SSR)을 지원하는 React 프레임워크
- **React**: 사용자 인터페이스를 구축하기 위한 JavaScript 라이브러리
- **TypeScript**: 자바스크립트에 정적 타입을 추가한 언어
- **ESLint**: 자바스크립트 및 TypeScript 코드의 문제를 찾아주는 Lint 도구
- **Prettier**: 코드 포맷터
- **Tailwind CSS**: 유틸리티 퍼스트 CSS 프레임워크

---

이 프로젝트는 **Next.js**를 기반으로 하고 있으며, ESLint와 Prettier를 통해 코드 품질과 일관성을 유지하도록 설정되어 있습니다.
