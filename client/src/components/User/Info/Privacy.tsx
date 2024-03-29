import { privacyPolicyVersion } from '../../../constants/version';
import { SettingOverlayProps } from '../../../screens/User';
import Button from '../../UI/button/Button';
import ConfirmCancelButtons from '../../UI/button/ConfirmCancelButtons';
import Overlay from '../../UI/overlay/Overlay';
import classes from './Privacy.module.css';

interface AgreeOverlayProps extends SettingOverlayProps {
  agree?: () => void 
}

const Privacy = ({ isOpen, onClose, agree }: AgreeOverlayProps) => {
  return (
    <Overlay
      id="privacy-policy"
      className={classes.privacy}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className={classes.contents}>
        <section>
          <h1>개인정보 처리방침</h1>
          <p>
            웨일블루스튜디오(이하 '회사')는 듀링가계부 서비스(이하 '서비스')를 제공하며
            개인정보보호법 및 관련 법령에 따라 사용자의 개인정보를 적법하고 안전하게
            보호합니다.
          </p>
          <p>
            회사는 개인정보 처리방침 공개를 통해 개인정보 처리에 관한 사항을 안내하고,
            이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이
            개인정보 처리방침을 수립·공개합니다.
          </p>
        </section>
        <section>
          <h3>1. 개인정보 수집과 이용</h3>
          <p>
            회사는 가계부 서비스 제공을 위해 다음의 개인정보항목을 수집하여 처리합니다.
          </p>
          <ul>
            <li>
              <h6>(1) 회원가입 시 사용자 식별을 위해 수집되는 개인정보</h6>
              <ul>
                <li>- 이메일로 회원가입: 이메일</li>
                <li>- Google 계정으로 회원가입: 이메일, 별명</li>
                <li>- Naver 계정으로 회원가입: 이메일, 별명</li>
                <li>- Kakaotalk 계정으로 회원가입: 이메일(선택), 별명</li>
              </ul>
            </li>
            <li>
              <h6>(2) 이용자의 추가 입력에 따라 수집되는 개인정보</h6>
              <ul>
                <li>- 휴대전화번호, 생일, 성별</li>
              </ul>
            </li>
            <li>
              <h6>(3) 서비스 제공을 위해 수집되는 사용자 입력 정보</h6>
              <ul>
                <li>- 가계부 작성 및 조회를 위한 내역 및 카테고리 정보</li>
                <li>- 반복되는 예산 관리를 위한 반복 예산 정보</li>
                <li>- 자산 현황 조회를 위한 자산 및 카드 정보</li>
              </ul>
            </li>
            <li>
              <h6>(4) 유료 서비스 이용 시 결제를 위해 수집되는 개인정보</h6>
            </li>
            <li>
              <h6>(5) 서비스 이용과정에서 자동으로 수집되는 개인정보</h6>
            </li>
          </ul>
        </section>

        <section>
          <h3>2. 개인정보처리 위탁 여부</h3>
          <p>회사는 서비스 제공을 위해 필요한 일부 업무 처리를 다음과 같이 위탁합니다.</p>
          <ul>
            <ul>
              <li>
                <h5>국내 처리 위탁 현황</h5>
                <ul>
                  <li>
                    <h6>- 토스페이먼츠</h6>
                    <ul>
                      <li>- 위탁업무: 결제 처리</li>
                      <li>- 이전위치: 국내</li>
                      <li>- 수집항목: 결제 처리 관련 정보</li>
                    </ul>
                  </li>
                  <li>
                    <h6>- 주식회사 채널코퍼레이션</h6>
                    <ul>
                      <li>- 위탁업무: 메신저고객센터 운영 및 고객상담(채널톡 서비스)</li>
                      <li>- 이전위치: 국내</li>
                      <li>
                        - 수집항목: 상담 내용 및 휴대폰, 이메일, 유저아이디 등의 고객 식별
                        정보
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li>
                <h5>국외 처리 위탁 현황</h5>
                <ul>
                  <li>
                    <h6>- Amazon Web Services Inc.</h6>
                    <ul>
                      <li>- 위탁업무: 데이터 보관 및 클라우드 인프라의 관리</li>
                      <li>
                        - 이전위치: Amazon Web Services Inc.의 리전 (아시아 태평양(서울))
                      </li>
                      <li>
                        - 보유 및 이용기간: 본 개인정보처리방침에 규정된 보유기간과 일치
                      </li>
                    </ul>
                  </li>
                  <li>
                    <h6>- Sentry</h6>
                    <ul>
                      <li>- 위탁업무: 크래시 수집 및 분석</li>
                      <li>
                        - 이전위치: 미국 (45 Fremont Street 8th Floor, San Francisco, CA
                        94105 USA)
                      </li>
                      <li>- 수집항목: 방문 일시, 서비스 이용 기록, 기기정보 등</li>
                      <li>- 보유 및 이용기간: 위탁계약 종료 시까지</li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </ul>
        </section>
        <section>
          <h3>3. 개인정보 보유기간 및 파기</h3>
          <p>
            회사는 서비스를 제공하는 동안 개인정보처리방침 및 관련법에 의거하여 이용자의
            개인정보를 지속적으로 관리 및 보관합니다. 탈퇴 등 개인정보 수집 및 이용목적이
            달성될 경우, 수집된 개인정보는 재생 불가능한 방법으로 즉시 파기됩니다.
          </p>

          <p>
            관계법령에 의해 개인정보를 보존해야하는 경우 해당 정보를 별도로 분리하여 관련
            법령에서 정한 기간에 따라 저장합니다.
          </p>
        </section>
        <section>
          <h3>4. 정보주체의 권리, 의무 및 행사</h3>
          <p>
            이용자는 서비스 내 설정 탭, 문의하기, 이메일(dev.during@gmail.com)을 통해
            자신의 개인정보를 조회하거나 수정, 삭제, 탈퇴할 수 있습니다.
          </p>
        </section>
        <section>
          <h3>5. 쿠키</h3>
          <p>회사는 사이트 로그인을 위한 아이디 식별에 '쿠키(cookie)'를 사용합니다. </p>

          <p>
            쿠키는 웹사이트를 운영하는데 이용되는 서버(http)가 이용자의 컴퓨터
            브라우저에게 보내는 소량의 정보이며 이용자들의 PC 컴퓨터내의 하드디스크에
            저장되기도 합니다.
          </p>

          <p>
            웹브라우저 상단의 도구 &gt; 인터넷 옵션 &gt; 개인정보 메뉴의 옵션 설정을 통해
            쿠키 저장을 거부 할 수 있습니다.
          </p>
        </section>
        <section>
          <h3>6. 개인정보의 안전성 확보 조치</h3>
          <p>
            회사는 개인정보 보호법, 신용정보의 이용 및 보호에 관한 법률, 전자금융거래법 등
            관련 법령에서 요구하는 기술적·관리적 보호조치 의무를 준수하며, 이용자의
            개인정보가 안전하게 보호될 수 있도록 합니다.
          </p>
        </section>
        <section>
          <h3>7. 개인정보보호책임자</h3>
          <p>
            회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한
            정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보보호 책임자를
            지정하고 있습니다.
          </p>
          <ul>
            <li>- 성명: 이윤지</li>
            <li>- 연락처: navyoonj@gmail.com</li>
          </ul>
        </section>
        <section>
          <h3>8.개인정보 처리방침의 개정</h3>
          <p>
            이 개인정보처리방침은 관련 법령의 변경, 내부 운영방침 등의 변경에 따라 개정될
            수 있습니다. 개정 시에는 개정 최소 7일 전부터 이메일을 통해 그 내용을
            공지합니다. 다만, 개인정보의 수집 및 활용 등에 있어 정보주체의 권리의 중요한
            변경이 있을 경우에는 최소 30일 전에 공지합니다.
          </p>
        </section>

        <p>
          <strong>최종개정일: {privacyPolicyVersion}</strong>
        </p>
      </div>
      <ConfirmCancelButtons
        confirmMsg={agree ? '동의하기' : '닫기'}
        closeMsg='닫기'
        hideCancle={!agree}
        disableSubmit={!!agree}
        isBottomSticky={true}
        onConfirm={() => {
          agree && agree();
          onClose();
        }}
        onClose={onClose}
      />
    </Overlay>
  );
};

export default Privacy;
