function updateSummaryContent(content) {
    const navbarContent = document.getElementById('navbarContent');
    if (navbarContent) {
        navbarContent.innerHTML = content;
    } else {
        console.error('Navbar content element not found');
    }
}

export function displaySummaryContent() {
    updateSummaryContent('<p style="color: #000000; text-align: left; margin-bottom: 20px;">운영체제(OS, Operating System)는 컴퓨터 하드웨어와 소프트웨어 자원을 관리하고, 사용자와 컴퓨터 사이의 인터페이스 역할을 하는 중요한 시스템 소프트웨어입니다.<br><br>컴퓨터 시스템의 모든 기본적인 작업을 조정하며, 다양한 응용 프로그램이 효율적으로 작동할 수 있도록 지원합니다.<br><br>운영체제는 CPU 시간, 메모리 공간, 파일 저장소 등과 같은 컴퓨터 자원을 효율적으로 배분하고 관리합니다.</p>');
}
