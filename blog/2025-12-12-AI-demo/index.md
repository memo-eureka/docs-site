---
title: Spring AI 연동 데모
authors: [doyen]
tags: [AI]
---

AI 기능 아이디어의 구현을 위해 Spring AI로 OpenAI API를 서비스에 연동하고자 데모 프로그램을 만들어보았습니다.

현재 Spring AI(1.0.0 버전)는 Spring Boot 3.4.x, 3.5.x 버전만 지원한다고 합니다.

저는 3.5.8 버전으로 생성했습니다.

### 의존성 추가
build.gradle.kts 파일의 전체 내용은 다음과 같습니다.

```
plugins {
    kotlin("jvm") version "1.9.25"
    kotlin("plugin.spring") version "1.9.25"
    id("org.springframework.boot") version "3.5.8"
    id("io.spring.dependency-management") version "1.1.7"
}

group = "org.doyen"
version = "0.0.1-SNAPSHOT"
description = "ai_demo2"

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(17)
    }
}

configurations {
    compileOnly {
        extendsFrom(configurations.annotationProcessor.get())
    }
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
    implementation("org.jetbrains.kotlin:kotlin-reflect")
    implementation ("org.springframework.ai:spring-ai-starter-model-openai") // 추가
    compileOnly("org.projectlombok:lombok")
    developmentOnly("org.springframework.boot:spring-boot-devtools")
    annotationProcessor("org.projectlombok:lombok")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.jetbrains.kotlin:kotlin-test-junit5")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

kotlin {
    compilerOptions {
        freeCompilerArgs.addAll("-Xjsr305=strict")
    }
}

dependencyManagement {
    imports {
        mavenBom("org.springframework.ai:spring-ai-bom:1.0.0") // 추가
    }
}

tasks.withType<Test> {
    useJUnitPlatform()
}
```

### API 키 추가
아래는 application.properties의 내용입니다.
API-KEY 자리에 [API keys](https://platform.openai.com/settings/organization/api-keys) 에서 만든 키를 넣어줍니다.
```
spring.application.name=ai_demo2
spring.ai.openai.api-key=API-KEY
```

### 데모 컨트롤러
다음은 테스트용 컨트롤러의 내용입니다.
```
package org.doyen.ai_demo2

import org.springframework.ai.chat.client.ChatClient
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

/**
 * AI Chat 기능을 위한 REST 컨트롤러입니다.
 * ChatClient를 사용하여 사용자의 요청을 OpenAI 모델에 전달하고 응답을 받습니다.
 */
@RestController
class AiController(chatClientBuilder: ChatClient.Builder) {

    // Spring AI가 제공하는 ChatClient를 주입받아 사용합니다.
    private val chatClient: ChatClient = chatClientBuilder.build()

    /**
     * GET 요청으로 "/chat" 엔드포인트를 처리합니다.
     * http://localhost:8080/chat?message=코틀린으로%20AI%20개발하는%20방법은? 와 같이 호출됩니다.
     *
     * @param message 사용자가 AI에게 보내는 질문 문자열
     * @return AI 모델의 답변 문자열
     */
    @GetMapping("/chat")
    fun chat(@RequestParam message: String): String? {
        println("사용자 질문 수신: $message")

        // 1. ChatClient.prompt()를 사용하여 프롬프트 구성을 시작합니다.
        // 2. user(message)를 통해 사용자의 메시지를 프롬프트에 포함합니다.
        // 3. call()로 AI 모델을 호출합니다.
        // 4. content()를 통해 최종 응답 텍스트만 추출합니다.
        val aiResponse = chatClient.prompt()
            .user(message)
            .call()
            .content()

        println("AI 응답: $aiResponse")
        return aiResponse
    }
}
```

### 결과
실행 후, curl로 요청 시 다음과 같은 결과를 확인할 수 있습니다.
결과가 나오는 데는 약 3초 정도 걸린 것 같습니다.
```
curl "http://localhost:8080/chat?message=%EC%BD%94%ED%8B%80%EB%A6%B0%EC%9C%BC%EB%A1%9C%20AI%20%EA%B0%9C%EB%B0%9C%ED%95%98%EB%8A%94%20%EA%B2%83%EC%97%90%20%EB%8C%80%ED%95%B4%20%EC%A7%A7%EA%B2%8C%20%EC%84%A4%EB%AA%85%ED%95%B4%20%EC%A4%98"
코틀린(Kotlin)은 주로 안드로이드 앱 개발에 사용되는 프로그래밍 언어지만, AI 개발에도 활용될 수 있습니다. 코틀린의 주요  장점은 간결한 문법과 높은 가독성으로, 이를 통해 머신러닝 및 데이터 과학 관련 라이브러리를 쉽게 사용할 수 있습니다.

AI 개발 시 코틀린은 다음과 같은 방법으로 활용될 수 있습니다:

1. **딥러닝 라이브러리 통합**: TensorFlow와 같은 인기 있는 딥러닝 프레임워크는 코틀린과 함께 사용할 수 있는 API를 제공합니다. 이를 통해 모델을 구축하고 학습시킬 수 있습니다.

2. **안드로이드 AI 앱 개발**: 코틀린은 안드로이드 앱 개발에 최적화되어 있어, AI 모델을 통합하여 이미지 인식, 자연어 처리(NLP) 등의 기능을 가진 앱을 쉽게 만들 수 있습니다.

3. **데이터 처리**: 코틀린의 확장 함수와 컬렉션 처리 기능을 활용하여 데이터 전처리 및 분석 작업을 효율적으로 수행할 수  있습니다.

4. **서버 사이드 개발**: Ktor와 같은 코틀린 기반 프레임워크를 사용하여 AI 서비스를 위한 서버를 구축할 수 있습니다.

결론적으로, 코틀린은 AI 개발에 필요한 다양한 도구와 라이브러리와의 통합이 용이하며, 특히 모바일 환경에서 AI 기능을 구현 하는 데 강점을 가지고 있습니다.
```
